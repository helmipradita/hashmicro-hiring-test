FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

RUN npx tsc

EXPOSE 8081

CMD ["node", "dist/main.js"]