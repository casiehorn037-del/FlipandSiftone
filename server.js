import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pg;

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDb() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS domains (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, tf INTEGER, cf INTEGER, rd INTEGER, price INTEGER, category VARCHAR(100), description TEXT, available BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init error:', err);
  }
}

const magicLinks = new Map();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/auth/magic-link', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const token = bcrypt.hashSync(email + Date.now(), 10);
  magicLinks.set(token, { email, expires: Date.now() + 15 * 60 * 1000 });
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://flipandsiftone.onrender.com' 
    : `http://localhost:${PORT}`;
  const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;
  console.log(`Magic link for ${email}: ${magicLink}`);
  res.json({ success: true, message: 'Magic link sent', ...(process.env.NODE_ENV !== 'production' && { magicLink }) });
});

app.get('/api/auth/verify', async (req, res) => {
  const { token } = req.query;
  const data = magicLinks.get(token);
  if (!data || Date.now() > data.expires) {
    return res.status(400).send('Invalid or expired link');
  }
  magicLinks.delete(token);
  let result = await pool.query('SELECT * FROM users WHERE email = $1', [data.email]);
  let user;
  if (result.rows.length === 0) {
    result = await pool.query('INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *', [data.email, data.email.split('@')[0]]);
    user = result.rows[0];
  } else {
    user = result.rows[0];
  }
  const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`/?token=${authToken}`);
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


app.get('/api/domains', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM domains WHERE available = true ORDER BY tf DESC LIMIT 50');
    res.json({ domains: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

app.post('/api/seed', async (req, res) => {
  const sampleDomains = [
    { name: 'wellnessvault.com', tf: 34, cf: 28, rd: 156, price: 2500, category: 'Health', description: 'Premium health domain' },
    { name: 'digitalmarketingpro.com', tf: 42, cf: 35, rd: 234, price: 4500, category: 'Marketing', description: 'High-authority marketing domain' },
    { name: 'techreviewshub.com', tf: 38, cf: 31, rd: 189, price: 3200, category: 'Technology', description: 'Tech review domain' },
    { name: 'fitnessgearhq.com', tf: 29, cf: 25, rd: 98, price: 1800, category: 'Fitness', description: 'Fitness equipment domain' },
    { name: 'cryptoinsider.net', tf: 45, cf: 38, rd: 267, price: 5200, category: 'Crypto', description: 'Cryptocurrency authority domain' },
    { name: 'organicrecipes.com', tf: 31, cf: 27, rd: 134, price: 2100, category: 'Food', description: 'Organic cooking domain' },
    { name: 'petcareguides.com', tf: 26, cf: 22, rd: 87, price: 1500, category: 'Pets', description: 'Pet care site' },
    { name: 'traveldealsnow.com', tf: 33, cf: 29, rd: 145, price: 2400, category: 'Travel', description: 'Travel deals domain' }
  ];
  try {
    for (const domain of sampleDomains) {
      await pool.query('INSERT INTO domains (name, tf, cf, rd, price, category, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING', [domain.name, domain.tf, domain.cf, domain.rd, domain.price, domain.category, domain.description]);
    }
    res.json({ success: true, message: 'Domains seeded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
