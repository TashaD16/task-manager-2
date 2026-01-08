# Деплой на Vercel

## Настройка переменных окружения

После деплоя на Vercel необходимо настроить переменные окружения:

1. Перейдите в настройки проекта на Vercel
2. Откройте **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Выберите окружения: **Production**, **Preview**, **Development**
5. Нажмите **Save**

## После настройки переменных

1. Перезапустите деплой (Redeploy) в Vercel Dashboard
2. Или выполните новый коммит, чтобы запустить автоматический деплой

## Настройка базы данных

Не забудьте выполнить SQL скрипт из `database.sql` в Supabase Dashboard (SQL Editor), чтобы создать таблицы:
- `categories`
- `plans`
- `tasks`

## Проверка работы

После настройки переменных и перезапуска деплоя, приложение должно работать корректно.
