/*
  # Добавление поля КПП в таблицу restaurants

  1. Изменения
    - Добавлено поле `kpp` (text) в таблицу `restaurants`
      Это поле содержит код причины постановки на учет (КПП) для каждого ресторана

  2. Примечания
    - КПП может отличаться для разных ресторанов одного юридического лица
    - Поле является опциональным (nullable)
*/

-- Добавление поля kpp в таблицу restaurants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'kpp'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN kpp text;
  END IF;
END $$;