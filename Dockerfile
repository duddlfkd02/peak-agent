# --- 빌더 스테이지 ---
# Next.js 빌드에 필요한 Node.js 환경
FROM node:20-alpine AS builder

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock 파일을 먼저 복사하여 의존성 캐싱 활용
COPY package.json yarn.lock ./

# yarn install --frozen-lockfile로 정확한 의존성 설치
# .yarnrc.yml 등 Yarn 관련 설정 파일이 있다면 함께 복사해야 할 수 있습니다.
RUN yarn install --frozen-lockfile

# 프로젝트 소스 코드 전체 복사
COPY . .

# Next.js 애플리케이션 빌드
# 환경 변수를 빌드 시점에 주입해야 한다면 여기서 ARG 또는 ENV 사용
ARG NEXT_PUBLIC_API_URL # 예시 환경 변수
ENV NEXT_PUBLIC_API_URL=http://ec2-3-35-216-5.ap-northeast-2.compute.amazonaws.com:8080
RUN yarn build

# --- 러너 스테이지 ---
# 실제 애플리케이션 실행에 사용할 가벼운 Node.js 환경
# builder 스테이지와 동일한 버전 사용 권장 (node_modules 복사 시 호환성 문제 방지)
FROM node:20-alpine AS runner

# 컨테이너 내 작업 디렉토리 설정 (builder와 동일하게)
WORKDIR /app

# package.json, yarn.lock (필요하다면), node_modules, .next, public 디렉토리 복사
# node_modules는 builder 스테이지에서 설치된 것을 그대로 가져옵니다.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 실행 시 필요한 환경 변수 설정 (빌드 시 필요한 변수와 다를 수 있음)
# .env.production 파일을 사용하거나, docker run 시 -e 옵션으로 전달
# 여기서는 예시로 ENV를 사용하지만, 민감 정보는 docker run 시 전달하는 것이 좋습니다.
ENV NEXT_PUBLIC_API_URL=http://ec2-3-35-216-5.ap-northeast-2.compute.amazonaws.com:8080
# ENV DATABASE_URL=... # 예시 환경 변수

# Next.js 기본 실행 포트 (package.json의 start 스크립트 확인)
EXPOSE 3000

# 애플리케이션 실행 명령어
CMD ["yarn", "start"]