ARG INTERNAL_REG
ARG EXTERNAL_REG
FROM ${INTERNAL_REG}/debian:bullseye as certs



FROM ${EXTERNAL_REG}/node:16 AS base
ARG APP_VERSION
ARG MAINTAINER_APP
ARG MAINTAINER_CD
LABEL envidat.ch.app-version="${APP_VERSION}" \
      envidat.ch.maintainer.app="${MAINTAINER_APP}" \
      envidat.ch.maintainer.cd="${MAINTAINER_CD}"
WORKDIR /app


FROM base AS debug
ENV NODE_ENV development
ENTRYPOINT ["node", "--inspect=0.0.0.0:9229", \
            "./node_modules/@vue/cli-service/bin/vue-cli-service.js", \
            "serve"]


FROM debug AS builder
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run modern-build -- --mode $NODE_ENV


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
