ARG INTERNAL_REG
ARG EXTERNAL_REG
FROM ${INTERNAL_REG}/debian:bullseye as certs



FROM node:16 AS base
ARG MAINTAINER_APP
ARG MAINTAINER_CD
LABEL envidat.ch.maintainer.app="${MAINTAINER_APP}"
LABEL envidat.ch.maintainer.cd="${MAINTAINER_CD}"
WORKDIR /app


FROM base AS local-dev
ENV NODE_ENV development
ENTRYPOINT ["npm", "run", "serve"]


FROM local-dev AS builder
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run build -- --mode $NODE_ENV


FROM nginx:1.21-alpine as prod
# CA-Certs
COPY --from=certs \
    /etc/ssl/certs/ca-certificates.crt \
    /etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./* /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY ./nginx /etc/nginx
COPY --from=builder --chown=101:101 /app/dist .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
