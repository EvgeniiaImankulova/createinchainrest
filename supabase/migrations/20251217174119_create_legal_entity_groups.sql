/*
  # Create Legal Entity Groups

  1. New Tables
    - `legal_entity_groups`
      - `id` (uuid, primary key)
      - `name` (text) - Group name
      - `description` (text) - Optional group description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `group_id` (uuid) to `legal_entities` table
    - Add foreign key constraint from `legal_entities.group_id` to `legal_entity_groups.id`

  3. Security
    - Enable RLS on `legal_entity_groups` table
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS legal_entity_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_entity_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view legal entity groups"
  ON legal_entity_groups
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert legal entity groups"
  ON legal_entity_groups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update legal entity groups"
  ON legal_entity_groups
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete legal entity groups"
  ON legal_entity_groups
  FOR DELETE
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN group_id uuid REFERENCES legal_entity_groups(id) ON DELETE SET NULL;
  END IF;
END $$;
