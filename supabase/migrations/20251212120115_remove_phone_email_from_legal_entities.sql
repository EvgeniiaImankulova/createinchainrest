/*
  # Удаление полей phone и email из legal_entities

  1. Изменения в таблице legal_entities
    - Удалены поля `phone` и `email` (общие контакты)
    - Контактная информация теперь хранится только для должностных лиц (владелец и главный бухгалтер)
    - Поля `director_phone`, `director_email`, `accountant_phone`, `accountant_email` сохраняются
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'phone'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN phone;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'legal_entities' AND column_name = 'email'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN email;
  END IF;
END $$;