# Деплой на Vercel

## Настройка переменных окружения для task-manager-2-olive.vercel.app

### Шаг 1: Получение данных из Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Скопируйте следующие значения:
   - **Project URL** → это будет `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** ключ → это будет `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Шаг 2: Настройка в Vercel Dashboard

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Найдите проект **task-manager-2** или перейдите по ссылке вашего проекта
3. Перейдите в **Settings** → **Environment Variables**

#### Добавьте первую переменную:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Ваш Supabase Project URL (например: `https://xxxxx.supabase.co`)
- **Environments:** Выберите все: ☑ Production, ☑ Preview, ☑ Development
- Нажмите **Save**

#### Добавьте вторую переменную:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Ваш Supabase anon public key
- **Environments:** Выберите все: ☑ Production, ☑ Preview, ☑ Development
- Нажмите **Save**

### Шаг 3: Перезапуск деплоя

После добавления переменных окружения:

1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите **⋯** (три точки) → **Redeploy**
4. Или выполните новый коммит в Git, чтобы запустить автоматический деплой

### Альтернативный способ: Через Vercel CLI

Если у вас установлен Vercel CLI:

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Добавьте переменные для всех окружений
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

## Настройка базы данных

Не забудьте выполнить SQL скрипт из `database.sql` в Supabase Dashboard (SQL Editor), чтобы создать таблицы:
- `categories`
- `plans`
- `tasks`

## Проверка работы

После настройки переменных и перезапуска деплоя:

1. Откройте `https://task-manager-2-olive.vercel.app`
2. Приложение должно загружаться без ошибок
3. Вы должны иметь возможность создавать планы и задачи

## Troubleshooting

### Приложение не подключается к базе данных
- Убедитесь, что переменные окружения добавлены для **Production** окружения
- Проверьте, что значения скопированы правильно (без лишних пробелов)
- Перезапустите деплой после добавления переменных

### Ошибка "Supabase URL or Anon Key is missing"
- Проверьте, что переменные начинаются с `NEXT_PUBLIC_`
- Убедитесь, что переменные добавлены для правильного окружения
- Перезапустите деплой

### База данных не работает
- Убедитесь, что SQL скрипт из `database.sql` выполнен в Supabase
- Проверьте RLS (Row Level Security) политики в Supabase
- Убедитесь, что таблицы `categories`, `plans`, `tasks` созданы
