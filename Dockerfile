# Используем официальный образ Node.js в качестве базового
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы проекта
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

COPY .env ./

# Указываем команду для запуска приложения
CMD ["npm", "start"]

# Открываем порт, если это необходимо (например, для Telegraf)
EXPOSE 3000
