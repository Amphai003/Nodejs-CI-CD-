# Node.js CI/CD Backend

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/Amphai003/Nodejs-CI-CD-/actions/workflows/ci.yml/badge.svg)](https://github.com/Amphai003/Nodejs-CI-CD-/actions/workflows/ci.yml)

Production-ready Node.js backend built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. Includes Jest tests, Docker support, and GitHub Actions CI/CD.

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js 20+             |
| Framework   | Express.js 5            |
| Language    | TypeScript              |
| ORM         | Prisma                  |
| Database    | PostgreSQL 16           |
| Testing     | Jest + Supertest        |
| Container   | Docker + Compose        |
| CI/CD       | GitHub Actions          |

## Project Structure

```
├── .github/workflows/ci.yml   # GitHub Actions pipeline
├── prisma/
│   ├── schema.prisma          # Database schema (User, Post)
│   └── migrations/            # Prisma migration files
├── src/
│   ├── config/                # Environment configuration
│   ├── controllers/           # HTTP request handlers
│   ├── middleware/            # Express middleware
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic layer
│   ├── app.ts                 # Express app factory
│   └── index.ts               # Application entry point
├── tests/
│   ├── unit/                  # Service unit tests
│   └── integration/           # API integration tests
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # App + PostgreSQL stack
└── jest.config.ts             # Jest configuration
```

## API Endpoints

| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | `/health`           | Health check       |
| GET    | `/api/users`        | List all users     |
| GET    | `/api/users/:id`    | Get user by ID     |
| POST   | `/api/users`        | Create a user      |
| PUT    | `/api/users/:id`    | Update a user      |
| DELETE | `/api/users/:id`    | Delete a user      |
| GET    | `/api/posts`        | List all posts     |
| GET    | `/api/posts/:id`    | Get post by ID     |
| POST   | `/api/posts`        | Create a post      |
| PUT    | `/api/posts/:id`    | Update a post      |
| DELETE | `/api/posts/:id`    | Delete a post      |

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [PostgreSQL](https://www.postgresql.org/) 16 (or use Docker — see below)

### 1. Clone and install

```bash
git clone https://github.com/Amphai003/Nodejs-CI-CD-.git
cd Nodejs-CI-CD-
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Copy `.env.example` to `.env`. The server starts without a database connection. Set `DATABASE_URL` only when you need the User/Post API routes:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodejs_cicd?schema=public"
```

### 3. Set up the database (optional)

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### Example requests

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice"}'

# Create a post (replace USER_ID with the id from the response above)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","content":"My first post","authorId":"USER_ID"}'
```

## Running with Docker

Docker Compose starts PostgreSQL, runs Prisma migrations on startup, and launches the app.

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop services
docker compose down
```

The API will be available at `http://localhost:3000`.

To reset the database volume:

```bash
docker compose down -v
```

### Pull from Docker Hub

Pre-built images are published to [Docker Hub](https://hub.docker.com/r/amphait0m/nodejs-ci-cd):

```bash
docker pull amphait0m/nodejs-ci-cd:latest

docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/nodejs_cicd?schema=public" \
  amphait0m/nodejs-ci-cd:latest
```

### Build and push to Docker Hub (manual)

```bash
# Log in to Docker Hub
docker login

# Build with BuildKit (recommended)
docker buildx build \
  --target production \
  --tag amphait0m/nodejs-ci-cd:latest \
  --tag amphait0m/nodejs-ci-cd:1.0.0 \
  --build-arg VERSION=1.0.0 \
  --build-arg REVISION=$(git rev-parse --short HEAD) \
  --push \
  .
```

### Automated Docker Hub publish (CI)

On every push to `main`, GitHub Actions runs tests, then builds and pushes a multi-arch image (`linux/amd64`, `linux/arm64`) to Docker Hub.

Add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username (`amphait0m`) |
| `DOCKERHUB_TOKEN` | Docker Hub [access token](https://hub.docker.com/settings/security) (not your account password) |

Image tags:

| Tag | When |
|-----|------|
| `latest` | Push to `main` |
| `<git-sha>` | Every publish |
| `1.0.0`, `1.0`, `1` | Git tag `v1.0.0` |

## Running Tests

Tests require a running PostgreSQL instance. The test suite uses a separate database (`nodejs_cicd_test`).

### With a local PostgreSQL instance

```bash
# Create the test database (if it doesn't exist)
createdb nodejs_cicd_test

# Set the test database URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodejs_cicd_test?schema=public"

# Run migrations against the test database
npx prisma migrate deploy

# Run all tests with coverage
npm test
```

### With Docker (PostgreSQL only)

```bash
docker compose up db -d

export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodejs_cicd_test?schema=public"
npx prisma migrate deploy
npm test
```

### Test commands

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm test`         | Run all tests with coverage report   |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run lint`     | Type-check without emitting files    |

Coverage reports are written to the `coverage/` directory.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests:

1. Spins up a PostgreSQL 16 service container
2. Installs dependencies with `npm ci`
3. Generates the Prisma client
4. Applies database migrations
5. Runs the full test suite with coverage
6. Uploads the coverage report as a workflow artifact

## Pushing to a New GitHub Repository

### 1. Create a repository on GitHub

Go to [github.com/new](https://github.com/new) and create a new empty repository (do not initialize with a README).

### 2. Push your code

```bash
git remote add origin https://github.com/Amphai003/Nodejs-CI-CD-.git
git branch -M main
git push -u origin main
```

### 3. Verify CI

After pushing, go to the **Actions** tab in your GitHub repository to confirm the CI pipeline passes.

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable       | Description                          | Default     |
|----------------|--------------------------------------|-------------|
| `PORT`         | HTTP server port                     | `3000`      |
| `NODE_ENV`     | Environment (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string         | *(optional)* |

## License

This project is licensed under the [MIT License](LICENSE).
