-- Email/Password authentication support
-- Make openId nullable for email auth users
ALTER TABLE `users` MODIFY `openId` varchar(64) NULL;

-- Add password hash column for email auth
ALTER TABLE `users` ADD `passwordHash` varchar(255);
