# Настройка переменных окружения в Vercel для task-manager-2-olive.vercel.app

## Способ 1: Через веб-интерфейс Vercel (Рекомендуется)

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Найдите проект **task-manager-2** или перейдите по ссылке: `https://vercel.com/[ваш-username]/task-manager-2/settings`
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте следующие переменные:

### Переменная 1: NEXT_PUBLIC_SUPABASE_URL
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Ваш Supabase Project URL (например: `https://xxxxx.supabase.co`)
- **Environments:** Выберите все: ☑ Production, ☑ Preview, ☑ Development
- Нажмите **Save**

### Переменная 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Ваш Supabase anon public key
- **Environments:** Выберите все: ☑ Production, ☑ Preview, ☑ Development
- Нажмите **Save**

## Способ 2: Через Vercel CLI

Если у вас установлен Vercel CLI, выполните следующие команды:

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Добавьте переменные окружения
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Введите значение при запросе

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Введите значение при запросе

# Добавьте для preview окружения
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Добавьте для development окружения
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

## Получение значений из Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Скопируйте:
   - **Project URL** → это `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** ключ → это `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## После настройки переменных

1. **Перезапустите деплой:**
   - В Vercel Dashboard откройте проект
   - Перейдите в **Deployments**
   - Найдите последний деплой и нажмите **⋯** (три точки) → **Redeploy**
   - Или выполните новый коммит в Git, чтобы запустить автоматический деплой

2. **Проверьте работу:**
   - Откройте `https://task-manager-2-olive.vercel.app`
   - Приложение должно загружаться без ошибок
   - Вы должны иметь возможность создавать планы и задачи

## Проверка переменных окружения

Чтобы убедиться, что переменные установлены правильно:

1. В Vercel Dashboard откройте проект
2. Перейдите в **Settings** → **Environment Variables**
3. Убедитесь, что обе переменные присутствуют и имеют правильные значения
4. Проверьте, что они выбраны для всех окружений (Production, Preview, Development)

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
