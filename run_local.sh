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
  --target local-dev \
  --tag "${INTERNAL_REG}/frontend:${VERSION}-local" \
  --build-arg NODE_ENV=development \
  --build-arg MAINTAINER_APP="${MAINTAINER_APP}" \
  --build-arg MAINTAINER_CD="${MAINTAINER_CD}" \
  --build-arg EXTERNAL_REG="${EXTERNAL_REG}"

docker push "${INTERNAL_REG}/frontend:${VERSION}-local"

VERSION="${VERSION}" docker compose \
  --file docker-compose.yml up -d
