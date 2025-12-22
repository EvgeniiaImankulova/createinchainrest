/*
  # Add patronymic field to employees table

  1. Changes
    - Add `patronymic` (отчество) column to `employees` table
    - Add sample employees with full names (Фамилия Имя Отчество)

  2. Notes
    - Patronymic is optional field
    - Existing employees will have null patronymic
*/

-- Add patronymic column to employees table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employees' AND column_name = 'patronymic'
  ) THEN
    ALTER TABLE employees ADD COLUMN patronymic text;
  END IF;
END $$;

-- Update existing employees with patronymics
UPDATE employees SET patronymic = 'Петрович' WHERE first_name = 'Иван' AND last_name = 'Петров';
UPDATE employees SET patronymic = 'Ивановна' WHERE first_name = 'Мария' AND last_name = 'Сидорова';
UPDATE employees SET patronymic = 'Сергеевич' WHERE first_name = 'Алексей' AND last_name = 'Иванов';
UPDATE employees SET patronymic = 'Владимировна' WHERE first_name = 'Елена' AND last_name = 'Смирнова';
UPDATE employees SET patronymic = 'Александрович' WHERE first_name = 'Дмитрий' AND last_name = 'Козлов';

-- Insert additional mock employees if they don't exist
INSERT INTO employees (first_name, last_name, patronymic, position)
SELECT 'Анна', 'Волкова', 'Сергеевна', 'Менеджер по закупкам'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Анна' AND last_name = 'Волкова');

INSERT INTO employees (first_name, last_name, patronymic, position)
SELECT 'Сергей', 'Новиков', 'Владимирович', 'Главный повар'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Сергей' AND last_name = 'Новиков');

INSERT INTO employees (first_name, last_name, patronymic, position)
SELECT 'Ольга', 'Морозова', 'Дмитриевна', 'Администратор'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Ольга' AND last_name = 'Морозова');

INSERT INTO employees (first_name, last_name, patronymic, position)
SELECT 'Михаил', 'Соколов', 'Андреевич', 'Бухгалтер'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Михаил' AND last_name = 'Соколов');

INSERT INTO employees (first_name, last_name, patronymic, position)
SELECT 'Татьяна', 'Лебедева', 'Николаевна', 'Маркетолог'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Татьяна' AND last_name = 'Лебедева');