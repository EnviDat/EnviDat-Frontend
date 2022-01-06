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
  --target prod \
  --tag "${INTERNAL_REG}/envidat-frontend:${VERSION}" \
  --build-arg NODE_ENV=production \
  --build-arg MAINTAINER=$MAINTAINER \
  --build-arg EXTERNAL_REG=$EXTERNAL_REG

docker push "${INTERNAL_REG}/envidat-frontend:${VERSION}"

VERSION=${VERSION} docker compose --file docker-compose.prod.yml up -d
