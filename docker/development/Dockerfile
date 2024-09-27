# Node.js 20.12.1 버전을 포함한 기본 이미지를 설정하고, 이를 base로 이름 붙임
FROM node:20.12.1 AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 선호하는 패키지 관리자를 기반으로 의존성을 설치
# yarn.lock 파일이 있으면 yarn을 사용하여 의존성을 설치
# package-lock.json 파일이 있으면 npm을 사용하여 의존성을 설치
# pnpm-lock.yaml 파일이 있으면 pnpm을 사용하여 의존성을 설치
# 어떤 lock 파일도 없으면 오류 메시지를 출력하고 종료
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. 필요한 경우에만 소스 코드를 다시 빌드
FROM base AS builder
WORKDIR /app
 # deps 단계에서 설치한 node_modules를 복사
COPY --from=deps /app/node_modules ./node_modules
# 현재 디렉토리의 모든 파일을 /app 디렉토리로 복사
COPY . .
# 환경에 맞는 env 파일을 복사
COPY .env.development.sample .env.production
 # 빌드 명령어 실행
RUN npm run build

# 3. 프로덕션 이미지를 생성, 모든 파일을 복사하고 Next.js 실행
FROM base AS runner
WORKDIR /app

# 환경 변수를 production으로 설정
ENV NODE_ENV=production 


# nodejs 그룹과 nextjs 유저를 생성
RUN addgroup --gid 1001 nodejs
RUN adduser --system --uid 1001 --gid 1001 nextjs

# 빌더 단계에서 생성된 public 디렉토리를 복사
COPY --from=builder /app/public ./public 

# 자동으로 출력 추적을 활용하여 이미지 크기 줄이기
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# nextjs 유저로 실행
USER nextjs

# 컨테이너가 3000 포트를 노출
EXPOSE 3000

# PORT 환경 변수를 3000으로 설정
ENV PORT 3000

# 애플리케이션 실행
# CMD HOSTNAME=localhost node server.js
CMD ["node", "server.js"]
