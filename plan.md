План: Таск-менеджер на Next.js + Supabase

  Этап 1: Настройка проекта

  npx create-next-app@latest task-manager --typescript --tailwind --app
  cd task-manager
  npm install @supabase/supabase-js

  Этап 2: База данных (Supabase)

  -- Таблица задач
  CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,
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

  Этап 3: Структура файлов

  app/
  ├── page.tsx              # Главная — список задач
  ├── layout.tsx            # Общий layout
  ├── components/
  │   ├── TaskList.tsx      # Список задач
  │   ├── TaskCard.tsx      # Карточка задачи
  │   ├── TaskForm.tsx      # Форма создания/редактирования
  │   ├── FilterBar.tsx     # Фильтры по приоритету/статусу
  │   └── PriorityBadge.tsx # Бейдж приоритета
  ├── lib/
  │   └── supabase.ts       # Клиент Supabase
  └── types/
      └── task.ts           # TypeScript типы

  Этап 4: Функции (по порядку реализации)
  ┌─────┬────────────────────────┬─────────────────────────────────────┐
  │  #  │        Функция         │              Описание               │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 1   │ Подключение к Supabase │ Клиент + env переменные             │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 2   │ Вывод списка задач     │ SELECT * FROM tasks                 │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 3   │ Создание задачи        │ INSERT с формой                     │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 4   │ Отметка выполнено      │ UPDATE completed                    │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 5   │ Редактирование         │ UPDATE title, description, priority │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 6   │ Удаление               │ DELETE с подтверждением             │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 7   │ Фильтр по приоритету   │ WHERE priority = ?                  │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 8   │ Фильтр по статусу      │ WHERE completed = ?                 │
  ├─────┼────────────────────────┼─────────────────────────────────────┤
  │ 9   │ Сортировка             │ ORDER BY created_at / priority      │
  └─────┴────────────────────────┴─────────────────────────────────────┘
  Этап 5: Примерный UI

  ┌─────────────────────────────────────────┐
  │  Task Manager          [+ Новая задача] │
  ├─────────────────────────────────────────┤
  │ Фильтры: [Все] [Высокий] [Средний] [Низкий] │
  │          [Активные] [Выполненные]       │
  ├─────────────────────────────────────────┤
  │ ☐ 🔴 Позвонить маме                     │
  │ ☐ 🟡 Выбрать цвет для проекта           │
  │ ☑ 🟢 Купить молоко                      │
  └─────────────────────────────────────────┘

  Этап 6: Расширения (потом)

  - Авторизация через Supabase Auth
  - Категории/теги
  - Дедлайны с уведомлениями
  - Drag-and-drop сортировка

  ---
  Готов начать с реализации? Могу создать проект и базу данных.

✻ Cogitated for 37s

❯ добавь еще категории 

⏺ Обновлённый план с категориями

  База данных

  -- Таблица категорий
  CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6B7280',  -- HEX цвет для UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Таблица задач (обновлённая)
  CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Начальные категории
  INSERT INTO categories (name, color) VALUES
    ('Работа', '#3B82F6'),
    ('Личное', '#10B981'),
    ('Покупки', '#F59E0B'),
    ('Здоровье', '#EF4444');

  Структура файлов (дополнение)

  app/
  ├── components/
  │   ├── ...
  │   ├── CategoryBadge.tsx    # Бейдж категории
  │   ├── CategorySelect.tsx   # Выбор категории в форме
  │   └── CategoryFilter.tsx   # Фильтр по категориям
  ├── types/
  │   ├── task.ts
  │   └── category.ts          # Тип категории

  Обновлённые функции
  ┌─────┬─────────────────────────┬─────────────────────────────────────────┐
  │  #  │         Функция         │                Описание                 │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 1-6 │ CRUD задач              │ Как раньше                              │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 7   │ Привязка категории      │ При создании/редактировании задачи      │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 8   │ Фильтр по категории     │ WHERE category_id = ?                   │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 9   │ CRUD категорий          │ Создание/редактирование своих категорий │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 10  │ Фильтр по приоритету    │ WHERE priority = ?                      │
  ├─────┼─────────────────────────┼─────────────────────────────────────────┤
  │ 11  │ Комбинированные фильтры │ Категория + приоритет + статус          │
  └─────┴─────────────────────────┴─────────────────────────────────────────┘
  Обновлённый UI

  ┌──────────────────────────────────────────────┐
  │  Task Manager                [+ Новая задача]│
  ├──────────────────────────────────────────────┤
  │ Категории: [Все] [🔵Работа] [🟢Личное] [🟡Покупки] │
  │ Приоритет: [Все] [Высокий] [Средний] [Низкий]│
  │ Статус:    [Активные] [Выполненные]          │
  ├──────────────────────────────────────────────┤
  │ ☐ 🔴 Позвонить маме           🟢 Личное     │
  │ ☐ 🟡 Выбрать цвет             🔵 Работа     │
  │ ☑ 🟢 Купить молоко            🟡 Покупки    │
  └──────────────────────────────────────────────┘

  SQL запрос с категорией (JOIN)

  SELECT
    tasks.*,
    categories.name AS category_name,
    categories.color AS category_color
  FROM tasks
  LEFT JOIN categories ON tasks.category_id = categories.id
  WHERE tasks.completed = false
  ORDER BY tasks.created_at DESC;


Примерные данные

  -- Категории
  INSERT INTO categories (name, color) VALUES
    ('Работа', '#3B82F6'),
    ('Личное', '#10B981'),
    ('Покупки', '#F59E0B'),
    ('Здоровье', '#EF4444'),
    ('Учёба', '#8B5CF6'),
    ('Дом', '#EC4899');

  -- Задачи
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

  Итого в базе
  ┌─────────────┬───────┬──────────┬───────────┐
  │  Категория  │ Задач │ Активных │ Выполнено │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🔵 Работа   │ 3     │ 2        │ 1         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🟢 Личное   │ 3     │ 2        │ 1         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🟡 Покупки  │ 3     │ 2        │ 1         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🔴 Здоровье │ 2     │ 1        │ 1         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🟣 Учёба    │ 2     │ 2        │ 0         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ 🩷 Дом      │ 3     │ 2        │ 1         │
  ├─────────────┼───────┼──────────┼───────────┤
  │ Всего       │ 16    │ 11       │ 5         │
  └─────────────┴───────┴──────────┴───────────┘
  Примеры запросов к этим данным

  -- Все невыполненные высокого приоритета
  SELECT t.title, c.name AS category
  FROM tasks t
  JOIN categories c ON t.category_id = c.id
  WHERE t.completed = false AND t.priority = 'high';

  -- Результат:
  -- Подготовить презентацию | Работа
  -- Позвонить маме          | Личное
  -- Пройти урок по SQL      | Учёба
  -- Вызвать сантехника      | Дом
