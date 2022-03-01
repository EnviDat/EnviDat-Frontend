ARG EXTERNAL_REG

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
COPY package*.json .
RUN npm install
COPY . .
ENV NODE_ENV production
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build -- --mode $NODE_ENV


FROM nginx:1.21-alpine as prod
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./*
COPY --from=builder /app/dist .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
