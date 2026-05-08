# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
ENV DATABASE_URL="mysql://root:root@localhost:3306/hashmicro_hiring_test"
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# ---- Stage 2: Production ----
FROM node:18-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --from=builder --chown=appuser:appgroup /app/package-lock.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma

USER appuser

EXPOSE 8081

CMD ["node", "dist/main.js"]
