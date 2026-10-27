# HustleHub+ React frontend

# Stage 1: build the static site
FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines this at build time, so it must point at the API as the browser sees it
ARG VITE_API_URL=https://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve the build with nginx, running as a non-root user
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
