/*
  # Временные публичные политики для разработки

  1. Изменения
    - Удаляем существующие политики, требующие аутентификацию
    - Добавляем новые политики без требования аутентификации
    - Это позволит работать с базой данных без необходимости входа в систему

  2. Безопасность
    - Эти политики предназначены только для разработки
    - В продакшене следует вернуть политики с проверкой аутентификации
*/

-- Удаляем старые политики для legal_entities
DROP POLICY IF EXISTS "Users can view all legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can insert legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can update legal entities" ON legal_entities;
DROP POLICY IF EXISTS "Users can delete legal entities" ON legal_entities;

-- Создаем новые публичные политики для legal_entities
CREATE POLICY "Public can view all legal entities"
  ON legal_entities FOR SELECT
  USING (true);

CREATE POLICY "Public can insert legal entities"
  ON legal_entities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update legal entities"
  ON legal_entities FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete legal entities"
  ON legal_entities FOR DELETE
  USING (true);

-- Удаляем старые политики для restaurants
DROP POLICY IF EXISTS "Users can view all restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can insert restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can update restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can delete restaurants" ON restaurants;

-- Создаем новые публичные политики для restaurants
CREATE POLICY "Public can view all restaurants"
  ON restaurants FOR SELECT
  USING (true);

CREATE POLICY "Public can insert restaurants"
  ON restaurants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update restaurants"
  ON restaurants FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete restaurants"
  ON restaurants FOR DELETE
  USING (true);
