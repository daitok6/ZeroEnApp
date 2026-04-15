-- Add NDA acceptance tracking to applications table
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS nda_accepted boolean NOT NULL DEFAULT false;
