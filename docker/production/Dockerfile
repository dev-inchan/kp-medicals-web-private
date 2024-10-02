ARG AWS_ACCOUNT_ID
ARG AWS_DEFAULT_REGION
ARG BASE_IMAGE_NAME
ARG BASE_IMAGE_TAG

# Base 스테이지: 이미지 기반 다른 스테이지에서 사용할 기본 환경을 정의
FROM ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${BASE_IMAGE_NAME}:${BASE_IMAGE_TAG} AS base
# FROM node:20.12.1 AS base

# Deps(Dependencies) 스테이지: 필요에 따라 Base 스테이지를 기반으로 종속성 설치, 필요한 패키지 설치(package.json과 잠금 파일을 복사한 후 종속성을 설치한다)
FROM base AS deps

WORKDIR /app

# npm 버전 업데이트 추가
RUN npm install -g npm@10.8.3

# 어떤 lock 파일이 있는 지에 따라, 다른 패키지 매니저를 설치
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Builder 스테이지: 필요에 따라 base 스테이지를 기반으로 하여 소스 코드 빌드, deps 스테이지에서 설치한 종속성을 복사하고, 소스 코드를 복사한 후 빌드합니다.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# 로컬 머신 즉 Repository에 있는 모든 파일을 builder 스테이지의 WORKDIR로 복사
COPY . .
# development 환경 변수를 이미지 내에서는 production 환경 변수인 것처럼 사용
# 원본
COPY .env.production .env.production
# 임시
# COPY .env.staging .env.development
RUN npm run build

# Runner 스테이지: base 스테이지를 기반으로 최종 실행 환경을 설정한다. 이때 deps 스테이지에서 설치한 종속성을 복사하고, 소스 코드를 복사한 후 빌드한다.
# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# 원본
ENV NODE_ENV=production
# 임시
# ENV NODE_ENV=development

# 도커 컨테이너는 기본적으로 root 사용자로 실행돼서, 과도한 권한을 주는 것을 방지하는 목적
# root 사용자로 실행하고 싶으면 아래에 있는 사용자, 그룹 관련 코드를 제거하면 됨
RUN addgroup --gid 1001 nodejs
RUN adduser --system --uid 1001 --gid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 추가적으로 만든 모듈에 실행에 필요한 디렉토리 복사
# COPY --from=builder --chown=nextjs:nodejs /app/custom_modules ./custom_modules
COPY --from=builder --chown=nextjs:nodejs /app/logs ./logs

# Next.js 실행에 필요한 node_modules를 복사
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

# 원본
CMD ["npm", "start"]