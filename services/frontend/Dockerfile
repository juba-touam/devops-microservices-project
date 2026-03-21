FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine
ARG CACHEBUST=1
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*
RUN addgroup -S appuser && adduser -S appuser -G appuser
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY images /usr/share/nginx/html/images
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
RUN chown -R appuser:appuser /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown appuser:appuser /var/run/nginx.pid
USER appuser
EXPOSE 80
