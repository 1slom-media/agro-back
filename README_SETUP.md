# Agrovolokno Backend - NestJS API

## Overview
This is the backend API for the Agrovolokno agricultural products e-commerce platform. Built with NestJS, TypeORM, and PostgreSQL.

## Tech Stack
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL (via TypeORM)
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

## Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup PostgreSQL database**:
```bash
# Create database
createdb agro_db

# Or using psql
psql -U postgres
CREATE DATABASE agro_db;
```

4. **Run the application**:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3001 |
| `API_PREFIX` | API route prefix | api |
| `DB_TYPE` | Database type | postgres |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_DATABASE` | Database name | agro_db |
| `DB_SYNCHRONIZE` | Auto-sync schema (dev only) | true |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRATION` | JWT token expiration | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `ADMIN_USERNAME` | Default admin username | islom_01 |
| `ADMIN_PASSWORD` | Default admin password | admin123 |

## Project Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities, DTOs, entities
│   │   ├── dto/            # Common DTOs (pagination, etc.)
│   │   ├── entities/       # Base entities
│   │   ├── decorators/     # Custom decorators
│   │   └── guards/         # Auth guards
│   ├── config/             # Configuration files
│   │   └── database.config.ts
│   ├── modules/            # Feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users management
│   │   ├── categories/    # Product categories
│   │   ├── products/      # Products CRUD
│   │   ├── blog/          # Blog posts
│   │   ├── applications/  # Form submissions
│   │   └── telegram/      # Telegram bot integration
│   ├── app.module.ts      # Root module
│   ├── app.controller.ts  # Root controller
│   ├── app.service.ts     # Root service
│   └── main.ts            # Application entry point
├── test/                   # E2E tests
├── .env                    # Environment variables
├── .env.example           # Environment template
└── package.json
```

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Authentication (Planned)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get current user

### Categories (Planned)
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Products (Planned)
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Blog (Planned)
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/blog` - Create blog post (admin)
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)

### Applications (Planned)
- `GET /api/applications` - List form submissions (admin)
- `POST /api/applications` - Submit contact form
- `PATCH /api/applications/:id/status` - Update status (admin)

## Development

### Running in development mode
```bash
npm run start:dev
```

### Running tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting
```bash
npm run lint
```

## Database Migrations

TypeORM synchronization is enabled in development (`DB_SYNCHRONIZE=true`). For production, use migrations:

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Security Notes

⚠️ **Important for Production**:
1. Change `JWT_SECRET` to a strong random string
2. Set `DB_SYNCHRONIZE=false` and use migrations
3. Use strong database credentials
4. Enable HTTPS
5. Configure proper CORS origins
6. Change default admin password

## Next Steps

The following modules need to be implemented:
- [ ] Authentication module with JWT
- [ ] Users module with admin user seeding
- [ ] Categories module with multilingual support
- [ ] Products module with image handling
- [ ] Blog module with SEO fields
- [ ] Applications module for form submissions
- [ ] Telegram bot integration

## Support

For issues or questions, contact the development team.

