/*
  # Удаление текстовых полей для контактов из таблицы legal_entities

  1. Изменения
    - Удаление поля `director_name` - теперь используется `director_id`
    - Удаление поля `accountant_name` - теперь используется `accountant_id`
    - Удаление поля `technologist_name` - теперь используется `technologist_id`
    - Удаление поля `production_manager_name` - теперь используется `production_manager_id`
  
  2. Примечания
    - Старые текстовые поля больше не нужны, так как теперь используются связи с таблицей employees
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'director_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN director_name;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'accountant_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN accountant_name;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'technologist_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN technologist_name;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'production_manager_name'
  ) THEN
    ALTER TABLE legal_entities DROP COLUMN production_manager_name;
  END IF;
END $$;
