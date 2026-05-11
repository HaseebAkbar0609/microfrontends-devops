# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm and git
RUN apk add --no-cache git && npm install -g pnpm

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN pnpm build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]