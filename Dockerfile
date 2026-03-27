# --- Stage 1: Build admin frontend ---
FROM node:20-slim AS admin-build
WORKDIR /app/admin
COPY admin/package*.json ./
RUN npm install
COPY admin/ ./
RUN npm run build

# --- Stage 2: Build bot backend ---
FROM node:18-slim AS bot-build
WORKDIR /app

# better-sqlite3 needs build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

# --- Stage 3: Production ---
FROM node:18-slim
WORKDIR /usr/src/app

# better-sqlite3 native addon needs libstdc++
RUN apt-get update && apt-get install -y --no-install-recommends libstdc++6 && rm -rf /var/lib/apt/lists/*

# Copy bot build
COPY --from=bot-build /app/dist ./dist
COPY --from=bot-build /app/node_modules ./node_modules
COPY --from=bot-build /app/package.json ./

# Copy admin frontend build
COPY --from=admin-build /app/admin/dist ./admin/dist

# Data directory for SQLite
RUN mkdir -p data

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
