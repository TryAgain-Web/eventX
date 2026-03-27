-- User profile fields for Settings page.
-- Run manually against your existing `users` table (adjust ordering as needed).

ALTER TABLE users
  ADD COLUMN bio VARCHAR(300) NULL,
  ADD COLUMN profilePicture VARCHAR(2048) NULL,
  ADD COLUMN socialLinks JSON NULL;

-- Optional: enforce username uniqueness at the DB level.
-- If you already have a unique index/constraint on `users.username`, skip this.
-- ALTER TABLE users ADD UNIQUE INDEX idx_users_username_unique (username);

