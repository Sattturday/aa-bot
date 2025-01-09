# Используем Node.js slim образ
FROM node:18-slim

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm install

# Копируем файлы проекта
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Удаляем devDependencies для уменьшения размера образа
RUN npm prune --production

# Устанавливаем переменную окружения
ENV NODE_ENV=production

# Запуск приложения
CMD ["npm", "start"]
