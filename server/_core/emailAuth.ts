import type { Express, Request, Response } from "express";
import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import * as db from "../db";
import { ENV } from "./env";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function getSecretKey() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

export async function createEmailSessionToken(userId: number, email: string, name: string | null): Promise<string> {
  const secretKey = getSecretKey();
  const issuedAt = Date.now();
  const expiresInMs = ONE_YEAR_MS;
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);

  return new SignJWT({
    userId: String(userId),
    email,
    name: name || "",
    type: "email_auth",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifyEmailSessionToken(token: string): Promise<{ userId: number; email: string; name: string } | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (payload.type !== "email_auth" || !payload.userId || !payload.email) {
      return null;
    }

    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      name: String(payload.name || ""),
    };
  } catch {
    return null;
  }
}

export function registerEmailAuthRoutes(app: Express) {
  // Register
  app.post("/api/auth/email/register", express.json(), async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
        return;
      }

      const { email, password, name } = parsed.data;

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const userId = await db.createEmailUser({
        email,
        name: name || null,
        passwordHash,
      });

      // Create session token
      const sessionToken = await createEmailSessionToken(userId, email, name || null);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.status(201).json({
        success: true,
        user: {
          id: userId,
          email,
          name: name || null,
        },
      });
    } catch (error: any) {
      console.error("[EmailAuth] Registration failed:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  });

  // Login
  app.post("/api/auth/email/login", express.json(), async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
        return;
      }

      const { email, password } = parsed.data;

      // Find user
      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Verify password
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Update last signed in
      await db.upsertUser({
        openId: user.openId || `email_${user.id}`,
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await createEmailSessionToken(user.id, user.email || email, user.name);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      console.error("[EmailAuth] Login failed:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });
}
