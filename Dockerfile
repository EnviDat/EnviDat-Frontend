ARG INTERNAL_REG
ARG EXTERNAL_REG


FROM ${EXTERNAL_REG}/debian:bullseye AS certs
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates


FROM ${EXTERNAL_REG}/node:16 AS base
ARG APP_VERSION
ARG MAINTAINER_APP
ARG MAINTAINER_CD
LABEL envidat.ch.app-version="${APP_VERSION}" \
      envidat.ch.maintainer.app="${MAINTAINER_APP}" \
      envidat.ch.maintainer.cd="${MAINTAINER_CD}"
WORKDIR /app
COPY package*.json ./
RUN npm install


FROM base AS debug
ENV NODE_ENV development
ENTRYPOINT ["node", "--inspect=0.0.0.0:9229", \
            "node_modules/.bin/vite", "--debug"]


FROM base AS builder
ENV NODE_ENV production
COPY . .
RUN npm run build -- --mode $NODE_ENV


FROM ${EXTERNAL_REG}/nginx:1.21-alpine as prod
# CA-Certs
COPY --from=certs \
    /etc/ssl/certs/ca-certificates.crt \
    /etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./* /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY ./nginx /etc/nginx
COPY --from=builder --chown=101:101 /app/dist .
EXPOSE 80
