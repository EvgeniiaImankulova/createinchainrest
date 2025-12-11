/*
  # Создание таблицы сотрудников

  ## Изменения
  
  1. Новая таблица `employees`:
     - `id` (uuid, primary key) - Уникальный идентификатор
     - `first_name` (text, обязательное) - Имя
     - `last_name` (text, обязательное) - Фамилия
     - `system_name` (text, необязательное) - Имя в системе
     - `phone` (text, необязательное) - Телефон
     - `email` (text, необязательное) - Email
     - `position` (text, необязательное) - Должность
     - `created_at` (timestamptz) - Дата создания
     - `updated_at` (timestamptz) - Дата обновления
  
  2. Безопасность:
     - Включить RLS
     - Добавить политики для аутентифицированных пользователей
*/

-- Создание таблицы сотрудников
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  system_name text,
  phone text,
  email text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_employees_last_name ON employees(last_name);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- Включение RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Политики для employees
CREATE POLICY "Users can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Обновление таблицы legal_entities для связи с employees
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'director_id') THEN
    ALTER TABLE legal_entities ADD COLUMN director_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_entities' AND column_name = 'accountant_id') THEN
    ALTER TABLE legal_entities ADD COLUMN accountant_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Обновление таблицы restaurants для связи с employees
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'owner_id') THEN
    ALTER TABLE restaurants ADD COLUMN owner_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;
