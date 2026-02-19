# ==============================
# Stage 1: 의존성 설치
# ==============================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ==============================
# Stage 2: 빌드
# ==============================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 프로덕션 환경에서는 백엔드를 도커 내부 네트워크로 연결
ENV NEXT_PUBLIC_API_URL=""

RUN npm run build

# ==============================
# Stage 3: 실행
# ==============================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 보안: non-root 유저
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js standalone 관련 파일 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3032

ENV PORT=3032
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
