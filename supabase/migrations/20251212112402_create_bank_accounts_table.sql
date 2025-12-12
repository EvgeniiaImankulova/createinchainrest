/*
  # Создание таблицы bank_accounts

  1. Новые таблицы
    - `bank_accounts` - расчетные счета юридических лиц
      - `id` (uuid, primary key)
      - `legal_entity_id` (uuid, foreign key) - связь с юридическим лицом
      - `account_number` (text) - номер расчетного счета
      - `bik` (text) - БИК банка
      - `correspondent_account` (text) - корреспондентский счет
      - `bank_name` (text) - название банка
      - `bank_city` (text) - город банка
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включен RLS для таблицы `bank_accounts`
    - Политика для чтения счетов
    - Политика для создания счетов
    - Политика для обновления счетов
    - Политика для удаления счетов

  3. Удаление полей из legal_entities
    - Удалены поля связанные с фактическим адресом
    - Удалены поля координат
    - Удалены поля комментариев к адресу
    - Удалены старые поля банковских реквизитов
    - Добавлены поля телефонов и email для владельца и бухгалтера
*/

CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_entity_id uuid REFERENCES legal_entities(id) ON DELETE CASCADE,
  account_number text NOT NULL,
  bik text,
  correspondent_account text,
  bank_name text,
  bank_city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to bank accounts"
  ON bank_accounts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to bank accounts"
  ON bank_accounts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to bank accounts"
  ON bank_accounts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to bank accounts"
  ON bank_accounts FOR DELETE
  TO public
  USING (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'legal_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN legal_name;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'legal_address_comment'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN legal_address_comment;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'legal_address_latitude'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN legal_address_latitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'legal_address_longitude'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN legal_address_longitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_street'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_street;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_city'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_city;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_region'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_region;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_country'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_country;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_postal_code'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_postal_code;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_comment'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_comment;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_latitude'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_latitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'actual_address_longitude'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN actual_address_longitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'bank_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN bank_name;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'bank_city'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN bank_city;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'bik'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN bik;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'correspondent_account'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN correspondent_account;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'payment_account'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN payment_account;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_phone'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN director_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'director_email'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN director_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_phone'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN accountant_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_email'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN accountant_email text;
  END IF;
END $$;