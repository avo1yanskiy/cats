# Катя и Гаврик

Сайт для двух замечательных кошек — Кати и Гаврика. Сайт включает галерею, видео и истории.

## Архитектура

```
nginx (ports 80, 443)  ← Reverse Proxy
    ↓ HTTP/HTTPS
cat-site (port 80)     ← React app (внутренний контейнер)
certbot                ← Автообновление SSL-сертификатов
```

## Запуск

### Локальная разработка

```bash
docker compose -f docker-compose.local.yml up -d --build
```

Открой http://localhost:80

### Продакшен (сервер)

```bash
docker compose -f docker-compose.yml up -d --build
```

Открой http://purr-tales.ru и https://purr-tales.ru

## Сервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| nginx | 80, 443 | Reverse Proxy с SSL |
| cat-site | 80 (internal) | React-приложение |
| certbot | - | Автообновление SSL |

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
docker logs cat-nginx
docker logs cat-site
docker logs certbot
```

### Команды на сервере

```bash
# Запуск
docker compose -f docker-compose.prod.yml up -d --build

# Остановка
docker compose -f docker-compose.prod.yml down

# Перезапуск nginx
docker restart cat-nginx

# Логи
docker logs cat-nginx --tail 20
docker logs cat-site --tail 20
docker logs certbot
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

### Автообновление через cron (опционально)

```bash
# Открыть crontab
crontab -e

# Добавить строку (каждый день в 3 ночи)
0 3 * * * cd /opt/cat-site && docker compose run --rm certbot renew >> /var/log/certbot-renew.log 2>&1
```

## Как добавить фото в галерею

1. Положи фотографии (`.webp`) в папку `assets/images/`
2. Открой файл `frontend/src/data/galleryPhotos.ts`
3. Добавь пути к новым файлам:
   ```ts
   export const galleryByYear: Record<string, string[]> = {
     '2025': [
       `${BASE_URL}/новое-фото.webp`,
     ],
   };
   ```
4. Пересобери проект:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

> **Важно:** Имена файлов чувствительны к регистру. Не используй пробелы и кириллицу.

## Как добавить видео

1. Конвертируй видео в формат **MP4 (H.264 + AAC)**. Формат H.265 не поддерживается.
2. Положи файл `.mp4` в папку `assets/videos/`
3. Открой файл `frontend/src/data/videos.ts`
4. Добавь новое видео:
   ```ts
   {
     id: 'video-4',
     title: 'Название видео',
     description: 'Описание',
     thumbnail: 'url-превью',
     videoUrl: 'url-видео',
   },
   ```
5. Пересобери проект

## Как редактировать истории

1. Открой файл `frontend/src/data/stories.ts`
2. Каждая история:
   ```ts
   {
     id: 'story-1',
     catId: 'katya', // 'katya', 'gavrik' или 'both'
     title: 'Заголовок',
     text: 'Текст истории...',
     date: '2024-01-01',
     images: ['url1', 'url2'], // опционально
   }
   ```
3. Пересобери проект

Где отображается:
- `catId: 'katya'` — в разделе "Катя"
- `catId: 'gavrik'` — в разделе "Гаврик"
- `catId: 'both'` — в разделе "Как мы прижились"

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
│   │   ├── data/          # Данные (фото, видео, истории)
│   │   └── pages/         # Страницы
│   └── public/            # Публичные файлы
├── assets/                 # Медиа файлы (фото, видео)
└── README.md
```

## CI/CD

При пуше в ветку `main`:
1. Собирается Docker-образ
2. Пушится в Docker Hub
3. Деплоится на сервер

Настройки в `.github/workflows/docker-image.yml`:
- `DOCKER_USERNAME` / `DOCKER_PASSWORD` — Docker Hub
- `SERVER_HOST` / `SERVER_USER` / `SERVER_SSH_KEY` — сервер

## DNS

Домены направлены на `132.243.226.131`

## Решение проблем

### 502 Bad Gateway

Проверить статус контейнеров:
```bash
docker ps
docker logs cat-nginx
docker logs cat-site
```

Проверить связь между контейнерами:
```bash
curl http://cat-site:80
```

Перезапустить:
```bash
docker compose -f docker-compose.prod.yml restart
```

### Nginx не стартует

Проверить конфигурацию:
```bash
docker exec cat-nginx nginx -t
```

Перезапустить:
```bash
docker restart cat-nginx
```

### Certbot ошибка "/var/www/certbot does not exist"

Убедиться что volume примонтирован:
```bash
docker volume ls | grep certbot
```

## История изменений

- **v2.0** — Reverse Proxy архитектура с nginx и certbot
- **v1.0** — Базовая версия с nginx внутри

## Контакты

Автор: avo1yanskiy
Email: avo1yanskiy@mail.ru