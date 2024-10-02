#!/bin/bash

# 환경 변수 설정
AWS_DEFAULT_REGION='ap-northeast-2'
AWS_ACCOUNT_ID='381492170774'
PROJECT_NAME='kp-medicalwallet'
GIT_BRANCH='main'
IMAGE_TAG='latest'

# Docker 이미지 이름 생성
IMAGE_REPO_NAME="${PROJECT_NAME}-${GIT_BRANCH}"
REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
IMAGE_NAME="${REPO_URI}/${IMAGE_REPO_NAME}:${IMAGE_TAG}"

# 특정 이미지로 실행 중인 컨테이너 ID 가져오기
container=$(docker ps -q --filter "ancestor=${IMAGE_NAME}")

if [ -n "$container" ]; then
    echo "Stopping and removing the '${IMAGE_NAME}' Docker container..."
    # 컨테이너 종료
    docker stop $container
    # 종료된 컨테이너 제거
    docker rm $container
else
    echo "No running '${IMAGE_NAME}' Docker container to stop."
fi