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

# 빌드 시점에 주입할 환경 변수 (포트원 V2)
ARG NEXT_PUBLIC_PORTONE_STORE_ID
ARG NEXT_PUBLIC_PORTONE_CHANNEL_KEY
ENV NEXT_PUBLIC_PORTONE_STORE_ID=$NEXT_PUBLIC_PORTONE_STORE_ID
ENV NEXT_PUBLIC_PORTONE_CHANNEL_KEY=$NEXT_PUBLIC_PORTONE_CHANNEL_KEY

# 프로덕션 환경에서는 백엔드를 도커 내부 네트워크로 연결
ENV NEXT_PUBLIC_API_URL=""
# BFF 프록시가 백엔드에 접속할 때 사용하는 내부 주소 (런타임 오버라이드 가능)
ENV API_BASE_URL=http://backend:8032

RUN npm run build

# ==============================
# Stage 3: 실행
# ==============================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# 런타임에 백엔드 컨테이너 주소를 기본값으로 설정
ENV API_BASE_URL=http://backend:8032

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
