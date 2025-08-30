# Use official Node.js image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies needed for Prisma binaries
RUN apk add --no-cache libc6-compat openssl

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies (use --frozen-lockfile if using yarn)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js project (use next build directly to skip migrations)
RUN npx next build

# Expose the port that Next.js listens on
EXPOSE 3000

# Start the application (you mentioned running migration separately via docker-compose)
CMD ["npm", "start"]
