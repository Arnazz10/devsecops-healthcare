# Stage 1: Build & Dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY app/package*.json ./
RUN npm install --production

# Stage 2: Final Runtime Image
FROM node:18-alpine

WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy only production dependencies and source code
COPY --from=builder /app/node_modules ./node_modules
COPY app/index.js ./

# Set Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "index.js"]
