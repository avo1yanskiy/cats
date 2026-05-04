# Катя и Гаврик

Сайт для двух замечательных кошек с галереей, видео и историями.

## Архитектура

```
nginx (ports 80, 443)  ← Reverse Proxy
    ↓
cat-site (port 3000)   ← React app (internal)
    ↓
certbot (auto renew)   ← SSL обновление
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

---

## Структура сервисов

| Сервис | Порт | Описание |
|--------|------|----------|
| nginx | 80, 443 | Reverse Proxy |
| cat-site | 3000 (internal) | React app |
| certbot | - | Автообновление SSL |

---

## Как добавить фото

1. Положи `.webp` в `assets/images/`
2. Открой `frontend/src/data/galleryPhotos.ts`
3. Добавь пути к файлам
4. Пересобери:
   ```bash
   docker compose -f docker-compose.local.yml up -d --build
   ```

---

## Как добавить видео

1. Конвертируй в **MP4 (H.264)**
2. Положи `.mp4` в `assets/videos/`
3. Открой `frontend/src/data/videos.ts`
4. Добавь видео в список
5. Пересобери

---

## Как редактировать истории

1. Открой `frontend/src/data/stories.ts`
2. Добавь/измени историю
3. Пересобери

---

## CI/CD

При пуше в `main`:
1. Собирается Docker-образ → Docker Hub
2. Деплоится на сервер
3. Nginx работает как reverse proxy на портах 80, 443
4. Certbot автоматически обновляет SSL

---

## DNS

Домены направлены на `132.243.226.131`

---

## SSL

Сертификат получен через Let's Encrypt. Certbot обновляет каждые ~90 дней автоматически.