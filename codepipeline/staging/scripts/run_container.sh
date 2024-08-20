#!/bin/bash

# 환경 변수 설정
AWS_DEFAULT_REGION='ap-northeast-2'
AWS_ACCOUNT_ID='381492170774'
PROJECT_NAME='kp-medicalwallet'
GIT_BRANCH='test'
IMAGE_TAG='latest'
DEPLOY_LEVEL='staging'
PROJECT_DIR='/home/kpm/kp-medicalwallet'

# Docker 이미지 이름 생성
IMAGE_REPO_NAME="${PROJECT_NAME}-${GIT_BRANCH}"
REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
IMAGE_NAME="${REPO_URI}/${IMAGE_REPO_NAME}:${IMAGE_TAG}"

# /etc/environment 파일 환경 변수 로드
source /etc/environment

# AWS 자격 증명 설정
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# AWS ECR 로그인
LOGIN_COMMAND=$(aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $REPO_URI)
if [ $? -ne 0 ]; then
    echo "Error: AWS ECR login failed."
    exit 1
fi

# Docker 이미지 Pull
docker pull $IMAGE_NAME
if [ $? -ne 0 ]; then
    echo "Error: Docker image pull failed."
    exit 1
fi

# Makefile이 있는 디렉토리로 이동(테스트 서버 기준)
cd $PROJECT_DIR

# Makefile을 사용하여 Docker 컨테이너 실행
make start-${DEPLOY_LEVEL}
if [ $? -ne 0 ]; then
    echo "Error: Makefile target 'start-${DEPLOY_LEVEL}' failed."
    exit 1
fi

# 태그가 <none>인 모든 Docker 이미지 삭제
docker images | grep '<none>' | awk '{print $3}' | xargs -r docker rmi