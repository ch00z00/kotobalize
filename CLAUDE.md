# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Frontend (Next.js)

```bash
# Run development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Run tests
cd frontend && npm test

# Run tests in watch mode
cd frontend && npm run test:watch

# Lint and fix code
cd frontend && npm run lint:fix

# Format code
cd frontend && npm run format

# Type generation from OpenAPI
cd frontend && npm run gen:types

# Run Storybook
cd frontend && npm run storybook
```

### Backend (Golang)

```bash
# Run tests
cd backend/generated-server && go test ./...

# Run tests with coverage
cd backend/generated-server && go test -cover ./...

# Run a specific test
cd backend/generated-server && go test -run TestName ./...

# Tidy dependencies
cd backend/generated-server && go mod tidy

# Run golangci-lint (if installed)
cd backend/generated-server && golangci-lint run

# Build the backend
cd backend/generated-server && go build -o main .
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## Architecture Overview

### Project Structure

- **Frontend**: Next.js app with TypeScript, located in `/frontend`
  - Uses App Router (Next.js 15)
  - State management with Zustand
  - UI components organized in atomic design pattern (atoms, molecules, organisms)
  - API client generated from OpenAPI spec
- **Backend**: Go server using Gin framework, located in `/backend/generated-server`
  - Generated from OpenAPI specification
  - JWT-based authentication
  - GORM for database operations
  - MySQL database
  - OpenAI integration for AI reviews

### Key API Flows

1. **Authentication**: Email + password with JWT tokens

   - Register: `POST /api/auth/signup`
   - Login: `POST /api/auth/login`
   - Protected routes use JWT middleware

2. **Theme Management**: Language practice topics

   - List themes: `GET /api/themes`
   - Get theme details: `GET /api/themes/:id`

3. **Writing Flow**: Core functionality
   - Create writing: `POST /api/writings`
   - Get AI review: `POST /api/review`
   - View history: `GET /api/writings`

### Database Schema

- **users**: User accounts with profiles
- **themes**: Practice topics/prompts
- **writings**: User submissions with AI feedback
- **user_favorite_themes**: Many-to-many relationship

### OpenAPI-First Development

The project uses OpenAPI specification (`openapi.yaml`) as the single source of truth:

- Backend models and routes are generated from the spec
- Frontend TypeScript types are generated using `npm run gen:types`
- Any API changes should start by updating the OpenAPI spec

### Deployment

- Uses GitHub Actions for CI/CD
- Deploys to Google Cloud Run
- Backend connects to Cloud SQL (MySQL)
- Frontend served as static site
- Secrets managed via Google Secret Manager

## Important Instructions for Claude Code

### Bash Command Execution

When executing commands that require changing directories:
- **ALWAYS** run the `cd` command separately from the subsequent command
- **DO NOT** use `&&` or `;` to chain `cd` with other commands
- **DO NOT** combine directory changes with command execution

**Correct approach:**
```bash
# First command: change directory
cd /path/to/directory

# Second command: execute the actual command
npm install
```

**Incorrect approach (DO NOT USE):**
```bash
# DO NOT do this
cd /path/to/directory && npm install

# DO NOT do this either
cd /path/to/directory; npm install
```

This ensures proper command execution and avoids potential errors in the environment.
