/*
  # Remove is_franchise field from restaurants table

  1. Changes
    - Remove `is_franchise` column from `restaurants` table
    - Keep `royalty_percent` column for franchise restaurants (will be populated based on legal entity)
  
  2. Notes
    - The franchise status will now be determined by the associated legal entity's `is_franchise` field
    - `royalty_percent` can still be customized per restaurant
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'is_franchise'
  ) THEN
    ALTER TABLE restaurants DROP COLUMN is_franchise;
  END IF;
END $$;