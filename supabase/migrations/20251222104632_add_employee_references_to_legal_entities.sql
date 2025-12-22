/*
  # Добавление связей с сотрудниками в таблицу legal_entities

  1. Изменения
    - Добавление поля `technologist_id` (uuid) - связь с таблицей employees для технолога
    - Добавление поля `production_manager_id` (uuid) - связь с таблицей employees для зав. производством
    - Эти поля дополняют уже существующие `director_id` и `accountant_id`
  
  2. Примечания
    - Все поля опциональные (nullable)
    - При удалении сотрудника ссылка устанавливается в NULL (ON DELETE SET NULL)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'technologist_id'
  ) THEN
    ALTER TABLE legal_entities 
    ADD COLUMN technologist_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'legal_entities' AND column_name = 'production_manager_id'
  ) THEN
    ALTER TABLE legal_entities 
    ADD COLUMN production_manager_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;
