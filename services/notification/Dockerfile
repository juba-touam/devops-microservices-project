FROM node:20-alpine
RUN addgroup -S appuser && adduser -S appuser -G appuser
WORKDIR /app
COPY package*.json ./
RUN npm install --production --ignore-scripts
COPY src ./src
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 3001
CMD ["node", "src/index.js"]
