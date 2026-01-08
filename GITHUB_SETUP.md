# Инструкция по загрузке на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Заполните:
   - **Repository name**: `task-manager-2` (или другое название)
   - **Description**: `Task Manager with Next.js, Supabase, Plans and Categories`
   - **Visibility**: Public или Private (на ваше усмотрение)
   - **НЕ** добавляйте README, .gitignore или лицензию (они уже есть в проекте)
3. Нажмите **"Create repository"**

## Шаг 2: Подключите локальный репозиторий к GitHub

После создания репозитория GitHub покажет команды. Выполните их в терминале:

```bash
git remote add origin https://github.com/ВАШ_USERNAME/task-manager-2.git
git branch -M main
git push -u origin main
```

**Или если используете SSH:**
```bash
git remote add origin git@github.com:ВАШ_USERNAME/task-manager-2.git
git branch -M main
git push -u origin main
```

## Что уже готово:

✅ Git репозиторий инициализирован  
✅ Все файлы добавлены в коммит  
✅ Создан первый коммит  
✅ Ветка переименована в `main`  
✅ `.gitignore` настроен правильно  

## Важно:

- Файл `.env` с вашими Supabase ключами **НЕ** будет загружен на GitHub (он в `.gitignore`)
- Это правильно для безопасности
- Не загружайте секретные ключи в публичный репозиторий

## После загрузки:

Ваш проект будет доступен по адресу:
`https://github.com/ВАШ_USERNAME/task-manager-2`
