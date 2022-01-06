ARG EXTERNAL_REG

FROM node:16 AS base
ARG MAINTAINER
LABEL envidat.com.maintainer="${MAINTAINER}"
WORKDIR /app
COPY package*.json ./
RUN npm install
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . .

FROM base AS dev
ENTRYPOINT ["npm", "run", "serve"]

FROM base AS builder
RUN npm run build -- --mode $NODE_ENV

FROM nginx:1.21-alpine as prod
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./*
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
