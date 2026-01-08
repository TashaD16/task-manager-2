-- Таблица категорий
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',  -- HEX цвет для UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица планов
CREATE TABLE plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица задач
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Автообновление updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Начальные категории
INSERT INTO categories (name, color) VALUES
  ('Работа', '#3B82F6'),
  ('Личное', '#10B981'),
  ('Покупки', '#F59E0B'),
  ('Здоровье', '#EF4444'),
  ('Учёба', '#8B5CF6'),
  ('Дом', '#EC4899');

-- Примерные задачи
INSERT INTO tasks (title, description, priority, completed, category_id) VALUES
  -- Работа
  ('Подготовить презентацию', 'Слайды для встречи в понедельник', 'high', false,
    (SELECT id FROM categories WHERE name = 'Работа')),
  ('Ответить на письма', 'Разобрать входящие за неделю', 'medium', false,
    (SELECT id FROM categories WHERE name = 'Работа')),
  ('Созвон с командой', 'Еженедельный статус в 15:00', 'high', true,
    (SELECT id FROM categories WHERE name = 'Работа')),

  -- Личное
  ('Позвонить маме', NULL, 'high', false,
    (SELECT id FROM categories WHERE name = 'Личное')),
  ('Записаться к стоматологу', 'Плановый осмотр', 'medium', false,
    (SELECT id FROM categories WHERE name = 'Личное')),
  ('Поздравить Сашу с ДР', 'Купить подарок!', 'high', true,
    (SELECT id FROM categories WHERE name = 'Личное')),

  -- Покупки
  ('Купить продукты', 'Молоко, хлеб, яйца, сыр', 'medium', false,
    (SELECT id FROM categories WHERE name = 'Покупки')),
  ('Заказать корм коту', 'Royal Canin 4кг', 'low', false,
    (SELECT id FROM categories WHERE name = 'Покупки')),
  ('Купить подарок Саше', 'Книга или гаджет', 'high', true,
    (SELECT id FROM categories WHERE name = 'Покупки')),

  -- Здоровье
  ('Пробежка в парке', '5 км утром', 'medium', false,
    (SELECT id FROM categories WHERE name = 'Здоровье')),
  ('Выпить 2л воды', 'Ежедневная цель', 'low', true,
    (SELECT id FROM categories WHERE name = 'Здоровье')),

  -- Учёба
  ('Пройти урок по SQL', 'Модуль 8: WHERE фильтрация', 'high', false,
    (SELECT id FROM categories WHERE name = 'Учёба')),
  ('Сделать домашку', 'Практика с JOIN запросами', 'medium', false,
    (SELECT id FROM categories WHERE name = 'Учёба')),

  -- Дом
  ('Полить цветы', NULL, 'low', false,
    (SELECT id FROM categories WHERE name = 'Дом')),
  ('Вызвать сантехника', 'Течёт кран на кухне', 'high', false,
    (SELECT id FROM categories WHERE name = 'Дом')),
  ('Разобрать шкаф', 'Выбросить старые вещи', 'low', true,
    (SELECT id FROM categories WHERE name = 'Дом'));
