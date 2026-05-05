FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/ ./
COPY assets/images ./public/images
COPY assets/videos ./public/video-files
RUN npm install
RUN npm run build

# Запускаем простой HTTP сервер для dev
FROM node:20-alpine

WORKDIR /app/frontend
COPY --from=builder /app/frontend/dist ./dist
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY frontend/package.json ./

EXPOSE 80

CMD ["npx", "serve", "-s", "dist", "-l", "80"]
