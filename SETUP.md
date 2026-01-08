# Инструкция по настройке

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации проекта

## Шаг 2: Настройка базы данных

1. В Supabase Dashboard откройте **SQL Editor**
2. Скопируйте содержимое файла `database.sql`
3. Вставьте в SQL Editor и выполните запрос (кнопка Run)
4. Убедитесь, что таблицы `categories`, `tasks` и `plans` созданы
5. Проверьте в **Table Editor**, что все три таблицы существуют

## Шаг 3: Получение ключей API

1. В Supabase Dashboard откройте **Settings** → **API**
2. Скопируйте следующие значения:
   - **Project URL** (это `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** ключ (это `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Шаг 4: Настройка переменных окружения

1. Создайте файл `.env.local` в корне проекта
2. Добавьте следующие строки:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Замените значения на ваши реальные данные из шага 3.

## Шаг 5: Запуск проекта

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Проверка работы

После выполнения всех шагов вы должны увидеть:
- 6 категорий (Работа, Личное, Покупки, Здоровье, Учёба, Дом)
- 16 примерных задач
- Возможность создавать, редактировать и удалять задачи
- Фильтрацию и сортировку

## Troubleshooting

### Ошибка "Supabase URL or Anon Key is missing"
- Убедитесь, что файл `.env.local` создан в корне проекта
- Проверьте, что переменные начинаются с `NEXT_PUBLIC_`
- Перезапустите dev сервер после создания/изменения `.env.local`

### Ошибка при загрузке задач
- Проверьте, что SQL скрипт выполнен успешно
- Убедитесь, что таблицы созданы в Supabase Dashboard → Table Editor
- Проверьте права доступа (RLS policies) - для тестирования можно временно отключить RLS

### Ошибка при загрузке планов
- Проверьте, что таблица `plans` создана в базе данных
- Убедитесь, что выполнен обновленный SQL скрипт из `database.sql`
- Проверьте права доступа (RLS policies) для таблицы `plans`

### RLS (Row Level Security)
Если включен RLS, создайте политики для всех таблиц:
```sql
-- Разрешить все операции для анонимных пользователей (только для разработки!)
CREATE POLICY "Allow all for anon" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON plans FOR ALL USING (true);
```

**Внимание:** Для production используйте правильные RLS политики с авторизацией!

### Альтернатива: Отключение RLS (только для разработки)
Если вы хотите временно отключить RLS для тестирования:
1. В Supabase Dashboard откройте **Authentication** → **Policies**
2. Для каждой таблицы (`tasks`, `categories`, `plans`) отключите RLS
3. Или выполните в SQL Editor:
```sql
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
```
