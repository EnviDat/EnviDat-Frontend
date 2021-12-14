#/bin/bash

set -eou pipefail
export DOCKER_BUILDKIT=1

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

docker build . \
  --tag "localhost:5000/envidat-frontend:dev-${VERSION}" \
  --build-arg NODE_ENV=development

docker push "localhost:5000/envidat-frontend:dev-${VERSION}"

VERSION=${VERSION} docker compose up -d
