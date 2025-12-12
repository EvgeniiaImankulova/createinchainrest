/*
  # Добавление полей в таблицу legal_entities

  1. Изменения
    - Добавлено поле `description` (описание организации)
    - Добавлено поле `okpo` (ОКПО)
    - Добавлено поле `registration_number` (регистрационный номер)
    - Добавлено поле `bank_city` (город банка)

  2. Примечания
    - Все поля необязательные (nullable)
    - Используется IF NOT EXISTS для предотвращения ошибок при повторном применении
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'description'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'okpo'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN okpo text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'registration_number'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN registration_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'bank_city'
  ) THEN
    ALTER TABLE legal_entities ADD COLUMN bank_city text;
  END IF;
END $$;