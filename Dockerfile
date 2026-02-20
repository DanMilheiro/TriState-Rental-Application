# ============================================
# Stage 1: Builder with ALL dependencies
# ============================================
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies including devDependencies (tsx, esbuild, vite, etc.)
RUN npm ci

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production with minimal dependencies
# ============================================
FROM node:20-slim AS production

# Install runtime dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Configure Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/public ./client/public

# Create directories for backups
RUN mkdir -p /app/backups/agreements \
             /app/backups/vehicles \
             /app/backups/database-dumps \
             /app/backups/logs

# Expose application port
EXPOSE 8080

# Set PORT for Fly.io
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
