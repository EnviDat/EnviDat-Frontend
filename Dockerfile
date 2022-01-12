ARG EXTERNAL_REG

FROM node:16 AS base
ARG MAINTAINER
LABEL envidat.com.maintainer="${MAINTAINER}"
WORKDIR /app
COPY package*.json ./
RUN npm install
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV


FROM base AS dev
COPY . .
ENTRYPOINT ["npm", "run", "serve"]


FROM dev AS builder
RUN npm run build -- --mode $NODE_ENV


FROM nginx:1.21-alpine as prod
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY --from=builder ./config.json ./config.json
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
