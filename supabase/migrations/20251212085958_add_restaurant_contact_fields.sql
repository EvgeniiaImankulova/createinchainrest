/*
  # Добавление полей контактной информации в таблицу ресторанов

  ## Изменения
  
  1. Добавление полей для владельца ресторана:
     - `owner_id` (uuid) - Ссылка на сотрудника (владельца)
     - `owner_phone` (text) - Телефон владельца
     - `owner_email` (text) - Email владельца
  
  2. Добавление полей для главного бухгалтера:
     - `accountant_id` (uuid) - Ссылка на сотрудника (бухгалтера)
     - `accountant_phone` (text) - Телефон бухгалтера
     - `accountant_email` (text) - Email бухгалтера
  
  3. Добавление поля для процента роялти:
     - `royalty_percent` (numeric) - Процент роялти для франчайзи
*/

-- Добавление полей для владельца ресторана
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN owner_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'owner_phone'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN owner_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'owner_email'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN owner_email text;
  END IF;
END $$;

-- Добавление полей для главного бухгалтера
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'accountant_id'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN accountant_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'accountant_phone'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN accountant_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'accountant_email'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN accountant_email text;
  END IF;
END $$;

-- Добавление поля для процента роялти
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'royalty_percent'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN royalty_percent numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Создание индексов для внешних ключей
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_accountant_id ON restaurants(accountant_id);