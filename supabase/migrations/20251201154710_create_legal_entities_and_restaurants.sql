/*
  # Создание таблиц для юридических лиц и ресторанов

  1. Новые таблицы
    - `legal_entities` - Юридические лица
      - `id` (uuid, primary key)
      - `name` (text) - Название
      - `legal_name` (text) - Юридическое название
      - `inn` (text) - ИНН
      - `kpp` (text) - КПП
      - `ogrn` (text) - ОГРН
      - `legal_address` (text) - Юридический адрес
      - `actual_address` (text) - Фактический адрес
      - `phone` (text) - Телефон
      - `email` (text) - Email
      - `director` (text) - Директор
      - `accountant` (text) - Главный бухгалтер
      - `bank_name` (text) - Название банка
      - `bik` (text) - БИК
      - `correspondent_account` (text) - Корреспондентский счет
      - `payment_account` (text) - Расчетный счет
      - `is_draft` (boolean, default false) - Черновик
      - `created_at` (timestamptz) - Дата создания
      - `updated_at` (timestamptz) - Дата обновления

    - `restaurants` - Рестораны
      - `id` (uuid, primary key)
      - `legal_entity_id` (uuid, foreign key) - Ссылка на юридическое лицо
      - `name` (text) - Название
      - `description` (text) - Описание
      - `short_name` (text) - Краткое название
      - `code` (text) - Код
      - `address` (text) - Адрес
      - `phone` (text) - Телефон
      - `email` (text) - Email
      - `website` (text) - Веб-сайт
      - `timezone` (text) - Часовой пояс
      - `template` (text) - Шаблон
      - `is_franchise` (boolean, default false) - Франчайзи
      - `is_draft` (boolean, default false) - Черновик
      - `connection_status` (text, default 'disconnected') - Статус подключения
      - `opening_hours` (jsonb) - Часы работы
      - `warehouse_settings` (jsonb) - Настройки склада
      - `terminal_settings` (jsonb) - Настройки терминалов
      - `external_settings` (jsonb) - Внешние настройки
      - `created_at` (timestamptz) - Дата создания
      - `updated_at` (timestamptz) - Дата обновления

  2. Безопасность
    - Включить RLS для всех таблиц
    - Добавить политики для аутентифицированных пользователей
*/

-- Создание таблицы юридических лиц
CREATE TABLE IF NOT EXISTS legal_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  inn text,
  kpp text,
  ogrn text,
  legal_address text,
  actual_address text,
  phone text,
  email text,
  director text,
  accountant text,
  bank_name text,
  bik text,
  correspondent_account text,
  payment_account text,
  is_draft boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы ресторанов
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_entity_id uuid REFERENCES legal_entities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  short_name text,
  code text,
  address text,
  phone text,
  email text,
  website text,
  timezone text DEFAULT 'Europe/Moscow',
  template text,
  is_franchise boolean DEFAULT false,
  is_draft boolean DEFAULT false,
  connection_status text DEFAULT 'disconnected',
  opening_hours jsonb,
  warehouse_settings jsonb,
  terminal_settings jsonb,
  external_settings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_restaurants_legal_entity ON restaurants(legal_entity_id);
CREATE INDEX IF NOT EXISTS idx_legal_entities_is_draft ON legal_entities(is_draft);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_draft ON restaurants(is_draft);

-- Включение RLS
ALTER TABLE legal_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Политики для legal_entities
CREATE POLICY "Users can view all legal entities"
  ON legal_entities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert legal entities"
  ON legal_entities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update legal entities"
  ON legal_entities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete legal entities"
  ON legal_entities FOR DELETE
  TO authenticated
  USING (true);

-- Политики для restaurants
CREATE POLICY "Users can view all restaurants"
  ON restaurants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete restaurants"
  ON restaurants FOR DELETE
  TO authenticated
  USING (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_legal_entities_updated_at ON legal_entities;
CREATE TRIGGER update_legal_entities_updated_at
  BEFORE UPDATE ON legal_entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
