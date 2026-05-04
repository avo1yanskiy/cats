# Катя и Гаврик

Сайт для двух замечательных кошек с галереей, видео и историями.

## Структура сервисов

| Сервис | Описание |
|--------|----------|
| **nginx** | Веб-сервер (порты 80, 443) |
| **cat-site** | React-приложение |
| **certbot** | SSL через Let's Encrypt |

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

---

## Структура сайта

- **Главная** (`/`) — Катя & Гаврик, котики
- **Галерея** (`/gallery`) — фото по годам
- **Видео** (`/videos`) — видео с фильтрацией
- **Истории** (`/stories`) — истории с таймлайном

---

## Файлы конфигурации

| Файл | Описание |
|------|----------|
| `nginx.conf` | Конфиг для продакшена (HTTP + HTTPS) |
| `nginx.local.conf` | Конфиг для localhost (только HTTP) |
| `docker-compose.yml` | Продакшен (nginx + cat-site + certbot) |
| `docker-compose.local.yml` | Локальная разработка (только cat-site) |
| `Dockerfile` | Билд фронтенда |

---

## SSL-сертификаты (Certbot)

Сертификаты получаются автоматически при первом запуске на сервере с доменами:

1. Домены должны указывать на IP сервера (132.243.226.131)
2. Запустить `docker compose -f docker-compose.yml up -d --build`
3. Certbot получит сертификаты для:
   - `purr-tales.ru`
   - `dev.purr-tales.ru`

Проверить сертификаты:
```bash
docker compose logs certbot
```

Обновить сертификаты (автоматически раз в 90 дней):
```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```

---

## Как добавить фото в галерею

1. Положи `.webp` в `assets/images/`
2. Открой `frontend/src/data/galleryPhotos.ts`
3. Добавь пути к файлам:
   ```ts
   export const galleryByYear: Record<string, string[]> = {
     '2025': [`${BASE_URL}/фото.webp`],
   };
   ```
4. Пересобери:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

---

## Как добавить видео

1. Конвертируй в **MP4 (H.264)**
2. Положи `.mp4` в `assets/videos/`
3. Открой `frontend/src/data/videos.ts`
4. Добавь:
   ```ts
   {
     id: 'video-4',
     title: 'Название',
     description: 'Описание',
     thumbnail: 'url-превью',
     videoUrl: 'url-видео',
   }
   ```
5. Пересобери:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

---

## Как редактировать истории

1. Открой `frontend/src/data/stories.ts`
2. Добавь/измени:
   ```ts
   {
     id: 'story-1',
     catId: 'katya', // 'katya', 'gavrik' или 'both'
     title: 'Заголовок',
     text: 'Текст...',
     date: '2024-01-01',
     images: ['url1', 'url2'],
   }
   ```
3. Пересобери:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

---

## CI/CD

При пуше в `main`:
1. Собирается Docker-образ → Docker Hub
2. Деплоится на сервер (ports 80, 443)
3. Запускается certbot для SSL

Настройки в `.github/workflows/docker-image.yml`:
- `DOCKER_USERNAME` / `DOCKER_PASSWORD`
- `SERVER_HOST` / `SERVER_USER` / `SERVER_SSH_KEY`