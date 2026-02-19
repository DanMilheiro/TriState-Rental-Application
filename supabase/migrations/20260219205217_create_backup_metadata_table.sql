/*
  # Create backup_metadata table for tracking local file backups

  1. New Tables
    - `backup_metadata`
      - `id` (uuid, primary key) - Unique identifier for backup record
      - `agreement_id` (uuid, foreign key) - Reference to rental agreement
      - `backup_type` (text) - Type of backup (pdf, json, csv, database_dump)
      - `file_path` (text) - Relative path to backup file in local storage
      - `file_size` (bigint) - Size of backup file in bytes
      - `backup_status` (text) - Status (success, failed, pending)
      - `error_message` (text, nullable) - Error details if backup failed
      - `backup_date` (timestamptz) - When backup was created
      - `verified` (boolean) - Whether backup integrity was verified
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `backup_metadata` table
    - Add policy for service role to manage all backup records
    - Public read access for backup status monitoring

  3. Indexes
    - Index on agreement_id for fast lookups
    - Index on backup_date for temporal queries
    - Index on backup_type for filtering
*/

CREATE TABLE IF NOT EXISTS backup_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid REFERENCES rental_agreements(id) ON DELETE CASCADE,
  backup_type text NOT NULL,
  file_path text NOT NULL,
  file_size bigint DEFAULT 0,
  backup_status text NOT NULL DEFAULT 'pending',
  error_message text,
  backup_date timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE backup_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to backup metadata"
  ON backup_metadata
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_backup_metadata_agreement_id 
  ON backup_metadata(agreement_id);

CREATE INDEX IF NOT EXISTS idx_backup_metadata_backup_date 
  ON backup_metadata(backup_date DESC);

CREATE INDEX IF NOT EXISTS idx_backup_metadata_backup_type 
  ON backup_metadata(backup_type);

CREATE INDEX IF NOT EXISTS idx_backup_metadata_status 
  ON backup_metadata(backup_status);