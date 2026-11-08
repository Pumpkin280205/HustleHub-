# HustleHub+ API
FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only 
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

# Create the logs folder so the app can save its log files
RUN mkdir -p logs && chown node:node logs

# Never run the API as root inside the container
USER node

EXPOSE 5000

# The certificate is self-signed, so the health check skips verification for this local call only
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "require('https').get({ host: 'localhost', port: process.env.PORT || 5000, path: '/', rejectUnauthorized: false }, r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
