#/bin/bash

set -eou pipefail
export DOCKER_BUILDKIT=1
source .env

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

docker build . \
  --target dev \
  --tag "${INTERNAL_REG}/envidat-frontend:dev-${VERSION}" \
  --build-arg NODE_ENV=development \
  --build-arg MAINTAINER=$MAINTAINER \
  --build-arg EXTERNAL_REG=$EXTERNAL_REG

docker push "${INTERNAL_REG}/envidat-frontend:dev-${VERSION}"

INTERNAL_REG=${INTERNAL_REG} VERSION=${VERSION} docker compose up -d
