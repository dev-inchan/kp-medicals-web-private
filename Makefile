# For local machine Development Test
.PHONY: build-development # .PHONY == 내가 입력한 명령어가 실제 타겟이 아니라, Makefile을 통해 설정된 가상의 타겟임을 지정하는 지시어
build-development: ## Build the development docker image.
	 docker compose -f docker/development/docker-compose.yml build

.PHONY: start-development
start-development: ## Start the development docker container.
	 docker compose -f docker/development/docker-compose.yml up -d

.PHONY: stop-development
stop-development: ## Stop the development docker container.
	 docker compose -f docker/development/docker-compose.yml down

# For test server before production
.PHONY: build-staging
build-staging: ## Build the staging docker image.
	 docker compose -f docker/staging/docker-compose.yml build

.PHONY: start-staging
start-staging: ## Start the staging docker container.
	 docker compose -f ../docker-compose.yml up -d
  
# For main production server 
.PHONY: build-production
build-production: ## Build the production docker image.
	 docker compose -f docker/production/docker-compose.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	 docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	 docker compose -f docker/production/docker-compose.yml down
