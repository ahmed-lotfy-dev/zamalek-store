# Deployment Guide

This application consists of two main processes that must run simultaneously:

1.  **Web Application (Next.js)**: Handles HTTP requests, UI, and API routes.
2.  **Background Worker**: Processes background jobs (email sending) from the Redis queue.

## 1. Prerequisites

Ensure your production environment has:

- **Node.js** (v18+)
- **Redis** (Running and accessible via `REDIS_HOST` and `REDIS_PORT`)
- **Database** (PostgreSQL)

## 2. Environment Variables

Ensure all `.env` variables are set in your production environment, including:

- `DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`
- `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USER`, `MAILTRAP_PASS`, `MAILTRAP_SENDER_EMAIL`

## 3. Running with PM2 (Recommended for VPS/EC2)

[PM2](https://pm2.keymetrics.io/) is a process manager that keeps your apps alive.

### Ecosystem File

Create an `ecosystem.config.js` in your root directory:

```javascript
module.exports = {
  apps: [
    {
      name: "zamalek-store-web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "zamalek-store-worker",
      script: "npm",
      args: "run worker",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

### Start Commands

```bash
# 1. Build the application
npm run build

# 2. Start both processes
pm2 start ecosystem.config.js

# 3. Save process list to restart on reboot
pm2 save
pm2 startup
```

## 4. Running with Docker

If you are using Docker, you can use `docker-compose` to run both services.

### docker-compose.yml

```yaml
version: "3"
services:
  web:
    build: .
    command: npm start
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=...
      - REDIS_HOST=redis
    depends_on:
      - redis
      - db

  worker:
    build: .
    command: npm run worker
    environment:
      - DATABASE_URL=...
      - REDIS_HOST=redis
    depends_on:
      - redis
      - db

  redis:
    image: redis:alpine
```

## 5. Running on Vercel / Netlify

Platform-as-a-Service (PaaS) providers like Vercel are optimized for the web application but **do not** natively support long-running background workers.

**Options:**

1.  **Separate Worker Service**: Deploy the web app to Vercel, and deploy the worker to a service that supports background processes (e.g., Railway, Render, Heroku, or a VPS).
2.  **Serverless Functions**: Refactor the email logic to run in a serverless function (e.g., Vercel Functions) instead of a background queue. This removes the need for a worker but may have timeout limits.
