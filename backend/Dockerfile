# Stage 1: Build & Install dependencies
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

COPY src ./src

# Stage 2: Final runtime image
FROM node:22-alpine

WORKDIR /app

# Copy production dependencies and source code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Set environment to production
ENV NODE_ENV=production

# Expose port (default 5000)
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]
