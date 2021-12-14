FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . .
RUN npm run build -- --mode $NODE_ENV



FROM nginx:1.21-alpine
WORKDIR /usr/share/nginx/html
# Remove default Nginx static assets
RUN rm -rf ./*
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
