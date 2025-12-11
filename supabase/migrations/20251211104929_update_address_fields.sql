/*
  # Обновление полей адреса

  ## Изменения
  
  1. Добавление расширенных полей адреса для таблиц:
     - `legal_entities` - для полей legal_address и actual_address
     - `restaurants` - для поля address
  
  2. Новые поля для каждого адреса:
     - `street` (text, обязательное) - Название улицы и дом
     - `city` (text, обязательное) - Город/населенный пункт
     - `region` (text, обязательное) - Область/регион
     - `country` (text, обязательное) - Страна
     - `postal_code` (text, необязательное) - Почтовый код
     - `comment` (text, необязательное) - Комментарии к адресу
     - `latitude` (numeric, необязательное) - Широта
     - `longitude` (numeric, необязательное) - Долгота
  
  3. Структура:
     - Старые текстовые поля сохраняются для обратной совместимости
     - Добавляются новые поля с префиксами для каждого типа адреса
*/

-- Добавление полей адреса для legal_entities (юридический адрес)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_street') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_city') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_region') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_region text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_country') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_country text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_postal_code') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_postal_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_comment') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_comment text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_latitude') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_latitude numeric(10, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'legal_address_longitude') THEN
    ALTER TABLE legal_entities ADD COLUMN legal_address_longitude numeric(11, 8);
  END IF;
END $$;

-- Добавление полей адреса для legal_entities (фактический адрес)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_street') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_city') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_region') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_region text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_country') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_country text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_postal_code') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_postal_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_comment') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_comment text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_latitude') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_latitude numeric(10, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'actual_address_longitude') THEN
    ALTER TABLE legal_entities ADD COLUMN actual_address_longitude numeric(11, 8);
  END IF;
END $$;

-- Добавление полей адреса для restaurants
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_street') THEN
    ALTER TABLE restaurants ADD COLUMN address_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_city') THEN
    ALTER TABLE restaurants ADD COLUMN address_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_region') THEN
    ALTER TABLE restaurants ADD COLUMN address_region text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_country') THEN
    ALTER TABLE restaurants ADD COLUMN address_country text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_postal_code') THEN
    ALTER TABLE restaurants ADD COLUMN address_postal_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_comment') THEN
    ALTER TABLE restaurants ADD COLUMN address_comment text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_latitude') THEN
    ALTER TABLE restaurants ADD COLUMN address_latitude numeric(10, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address_longitude') THEN
    ALTER TABLE restaurants ADD COLUMN address_longitude numeric(11, 8);
  END IF;
END $$;
