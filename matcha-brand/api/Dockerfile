FROM node:20-alpine
WORKDIR /app
COPY api/package.json api/server.js ./
COPY js/seed-data.js ./seed-data.js
ENV NODE_ENV=production DATA_DIR=/app/data
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME /app/data
EXPOSE 3000
USER node
CMD ["node", "server.js"]
