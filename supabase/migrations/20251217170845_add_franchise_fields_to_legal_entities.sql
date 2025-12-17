/*
  # Add Franchise Fields to Legal Entities

  1. Changes
    - Add `is_franchise` column to legal_entities table
    - Add `royalty_percent` column to legal_entities table

  2. Notes
    - `is_franchise` is a boolean field indicating if the legal entity is a franchisee
    - `royalty_percent` is a numeric field storing the royalty percentage (0-100)
    - These fields allow marking legal entities as franchisees and setting default royalty rates
    - Individual restaurants can override the royalty percentage if needed
*/

-- Add is_franchise column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'is_franchise'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN is_franchise boolean DEFAULT false;
  END IF;
END $$;

-- Add royalty_percent column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'royalty_percent'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN royalty_percent numeric(5,2);
  END IF;
END $$;