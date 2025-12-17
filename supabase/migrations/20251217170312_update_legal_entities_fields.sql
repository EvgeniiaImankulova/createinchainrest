/*
  # Update Legal Entities Table Fields

  1. Changes
    - Remove `registration_number` column
    - Add `okpd` column for OKPD code
    - Remove `director_id`, `director_phone`, `director_email` columns
    - Remove `accountant_id`, `accountant_phone`, `accountant_email` columns
    - Add `phone` column for general contact phone
    - Add `director_name` column for director's full name
    - Add `accountant_name` column for accountant's full name
    - Add `technologist_name` column for technologist's full name
    - Add `production_manager_name` column for production manager's full name

  2. Notes
    - This migration updates the legal entities table to store contact information as simple text fields
    - Previously stored director and accountant as foreign keys to employees table
    - Now storing names directly as text for simplicity
*/

-- Drop old columns if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'registration_number'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN registration_number;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_id'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN director_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_phone'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN director_phone;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_email'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN director_email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_id'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN accountant_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_phone'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN accountant_phone;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_email'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN accountant_email;
  END IF;
END $$;

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'okpd'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN okpd text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'phone'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_name'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN director_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_name'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN accountant_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'technologist_name'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN technologist_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'production_manager_name'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN production_manager_name text;
  END IF;
END $$;