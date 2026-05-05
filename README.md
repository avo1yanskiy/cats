# Катя и Гаврик

Сайт для двух замечательных кошек — Кати и Гаврика. Сайт включает галерею, видео и истории.

## Архитектура

```
nginx (ports 80, 443)  ← Reverse Proxy
    ↓ HTTP/HTTPS
cat-site (port 80)     ← React app (внутренний контейнер)
certbot                ← Автообновление SSL-сертификатов
bot                   ← Telegram бот для историй
```

## Запуск

### Локальная разработка

```bash
docker compose -f docker-compose.local.yml up -d --build
```

Открой http://localhost:3000

### Продакшен (сервер)

```bash
docker compose -f docker-compose.yml up -d --build
```

Открой http://purr-tales.ru и https://purr-tales.ru

## Разделы сайта

| Раздел | URL | Описание |
|--------|-----|---------|
| Главная | / | Катя и Гаврик |
| Галерея | /gallery | Фото по годам (2025, 2026, 2027) |
| Видео | /videos | Видео по годам |
| Истории | /stories | Истории по котам (Катя, Гаврик, Оба) |

## Сервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| nginx | 80, 443 | Reverse Proxy с SSL |
| cat-site | 80 (internal) | React-приложение |
| certbot | - | Автообновление SSL |
| bot | - | Telegram бот для добавления историй |

## Команды управления

### Локальные команды

```bash
# Запуск
docker compose -f docker-compose.local.yml up -d --build

# Остановка
docker compose -f docker-compose.local.yml down

# Перезапуск
docker compose -f docker-compose.local.yml restart

# Логи
docker compose logs nginx
docker compose logs cat-site
```

### Команды на сервере

```bash
# Запуск
docker compose -f docker-compose.yml up -d --build

# Остановка
docker compose -f docker-compose.yml down

# Перезапуск
docker compose restart

# Логи
docker compose logs nginx --tail 20
docker compose logs cat-site --tail 20
```

## SSL-сертификаты

### Текущий статус

- **Домен**: purr-tales.ru
- **Сертификат**: Let's Encrypt
- **Действителен до**: 2026-08-02

### Обновление сертификата

Сертификат обновляется автоматически. Для ручного обновления:

```bash
docker compose run --rm certbot renew
```

## Как добавить фото в галерею

1. Положи фотографии (`.webp`, `.jpg`) в папку `assets/images/`
2. Пересобери проект — данные генерируются автоматически

```bash
docker compose up -d --build cat-site
```

Фото автоматически группируются по годам (2025, 2026, 2027).

## Как добавить видео

1. Конвертируй видео в формат **MP4 (H.264 + AAC)**. Формат H.265 не поддерживается.
2. Положи файл `.mp4` в папку `assets/videos/`
3. Пересобери проект:

```bash
docker compose up -d --build cat-site
```

## Как редактировать истории

1. Открой файл `frontend/src/data/stories.ts`
2. Отредактируй историю:

```ts
{
  id: 'story-factory',
  title: 'Как мы прижились у нас дома',
  date: '2024-05-01',
  content: 'Текст истории...',
  catId: 'both', // 'katya', 'gavrik' или 'both'
},
```

3. Пересобери проект:

```bash
docker compose up -d --build cat-site
```

Где отображается:
- `catId: 'katya'` — в разделе "Катя"
- `catId: 'gavrik'` — в разделе "Гаврик"
- `catId: 'both'` — в разделе "Оба"

## Telegram бот для историй

Бот позволяет добавлять истории через Telegram.

### Запуск бота

```bash
docker compose up -d bot
```

### Команды бота

- `/start` — Приветствие
- `/newstory` — Добавить новую историю
- `/help` — Справка
- `/cancel` — Отмена

### Настройка переменных окружения

```bash
TELEGRAM_BOT_TOKEN=your_token
TOKEN_BOT=your_github_token
REPO_BOT=avo1yanskiy/cats
```

## Структура файлов

```
cats/
├── docker-compose.yml         # Продакшен
├── docker-compose.local.yml # Локальная разработка
├── nginx.conf               # Nginx config для продакшена
├── nginx.local.conf        # Nginx config для локальной разработки
├── Dockerfile              # Билд React-приложения
├── .github/workflows/     # CI/CD
├── frontend/               # React-приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   │   ├── Gallery.tsx
│   │   │   ├── StoryCard.tsx
│   │   │   └── ...
│   │   ├── data/          # Данные
│   │   │   ├── stories.ts
│   │   │   ├── videos.ts
│   │   │   └── galleryPhotos.ts
│   │   └── pages/         # Страницы
│   │       ├── GalleryPage.tsx
│   │       ├── VideoPage.tsx
│   │       └── StoriesPage.tsx
│   └── public/            # Публичные файлы
├── assets/                 # Медиа файлы
│   ├── images/            # Фото для галереи
│   └── videos/            # Видео
├── bot/                   # Telegram бот
│   ├── main.py
│   ├── config.py
│   ├── github.py
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```

## CI/CD

При пуше в ветку `main`:
1. Собирается Docker-образ
2. Пушится в Docker Hub
3. Деплоится на сервер

Настройки в `.github/workflows/docker-image.yml`:
- `DOCKER_USERNAME` / `DOCKER_PASSWORD` — Docker Hub
- `TELEGRAM_BOT_TOKEN` / `TOKEN_BOT` / `REPO_BOT` — Secrets для бота
- `SERVER_HOST` / `SERVER_USER` / `SERVER_SSH_KEY` — сервер

## DNS

Домены направлены на сервер с nginx.

## Решение проблем

### 502 Bad Gateway

Проверить статус контейнеров:
```bash
docker compose ps
docker compose logs nginx
docker compose logs cat-site
```

Проверить связь между контейнерами:
```bash
curl http://cat-site:80
```

Перезапустить:
```bash
docker compose restart
```

### Nginx не стартует

Проверить конфигурацию:
```bash
docker compose exec nginx nginx -t
```

### Бот не работает

Проверить логи:
```bash
docker compose logs bot
```

Проверить токен:
```bash
docker compose exec bot curl https://api.telegram.org
```

## История изменений

- **v3.0** — Новый дизайн с табами (годы для галереи/видео, коты для историй)
- **v2.0** — Reverse Proxy архитектура с nginx и certbot
- **v1.0** — Базовая версия с nginx внутри

## Контакты

Автор: avo1yanskiy
Email: avo1yanskiy@mail.ru