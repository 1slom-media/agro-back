# Backend Architecture Documentation

## Overview
This document describes the architecture and design patterns used in the Agrovolokno NestJS backend.

## Architecture Pattern
The backend follows a **modular monolithic architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│              (Controllers + Validation)                  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│                      (Services)                          │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                      │
│              (TypeORM Repositories)                      │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                        │
│                    (PostgreSQL)                          │
└─────────────────────────────────────────────────────────┘
```

## Module Structure

Each feature module follows this structure:

```
module-name/
├── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts    # Creation DTOs
│   ├── update-*.dto.ts    # Update DTOs
│   └── query-*.dto.ts     # Query/Filter DTOs
├── entities/              # TypeORM Entities
│   └── *.entity.ts
├── *.controller.ts        # HTTP Controllers
├── *.service.ts           # Business Logic
├── *.module.ts            # Module Definition
└── *.controller.spec.ts   # Unit Tests
```

## Core Modules

### 1. Common Module
Shared utilities, base classes, and decorators used across the application.

**Components**:
- `BaseEntity`: Base class for all entities with id, createdAt, updatedAt
- `PaginationDto`: Standard pagination DTO
- `PaginatedResult`: Standard paginated response interface
- Custom decorators (CurrentUser, Public, etc.)
- Guards (JwtAuthGuard, RolesGuard)

### 2. Config Module
Centralized configuration management using `@nestjs/config`.

**Features**:
- Environment variable validation
- Type-safe configuration access
- Database configuration factory
- JWT configuration

### 3. Auth Module (To be implemented)
Handles authentication and authorization.

**Features**:
- JWT-based authentication
- Passport strategies
- Login/logout endpoints
- Token refresh mechanism
- Password hashing with bcrypt

### 4. Users Module (To be implemented)
User management and admin operations.

**Features**:
- Admin user CRUD
- Default admin seeding
- Password management
- User roles and permissions

### 5. Categories Module (To be implemented)
Product category management with multilingual support.

**Features**:
- CRUD operations
- Multilingual names (uz, ru, en)
- Hierarchical categories (optional)
- Soft delete support

### 6. Products Module (To be implemented)
Product catalog management.

**Features**:
- CRUD operations
- Multilingual content
- Base64 image storage
- Filtering by category, usage, temperature, etc.
- Stock management
- SEO fields

### 7. Blog Module (To be implemented)
Blog post management with SEO optimization.

**Features**:
- CRUD operations
- Multilingual content
- Slug generation
- SEO meta tags
- Featured images (Base64)
- Published/draft status

### 8. Applications Module (To be implemented)
Form submission handling.

**Features**:
- Contact form submissions
- Calculator form submissions
- Status management (new, in-progress, completed)
- Email notifications
- Telegram notifications

### 9. Telegram Module (To be implemented)
Telegram bot integration for notifications and analytics.

**Features**:
- New application notifications
- Daily/weekly analytics
- Admin commands
- User interaction tracking

## Database Schema

### Core Tables

#### users
```sql
- id (uuid, PK)
- username (varchar, unique)
- email (varchar, unique)
- password (varchar, hashed)
- role (enum: admin, manager)
- createdAt (timestamp)
- updatedAt (timestamp)
```

#### categories
```sql
- id (uuid, PK)
- nameUz (varchar)
- nameRu (varchar)
- nameEn (varchar)
- slug (varchar, unique)
- createdAt (timestamp)
- updatedAt (timestamp)
```

#### products
```sql
- id (uuid, PK)
- nameUz/nameRu/nameEn (varchar)
- descriptionUz/descriptionRu/descriptionEn (text)
- categoryId (uuid, FK)
- usage (enum: greenhouse, open_field, mulch)
- temperature (varchar)
- density (varchar)
- width (varchar)
- price (decimal)
- image (text, base64)
- slug (varchar, unique)
- metaTitleUz/Ru/En (varchar)
- metaDescriptionUz/Ru/En (text)
- createdAt (timestamp)
- updatedAt (timestamp)
```

## API Design Principles

### RESTful Conventions
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Use plural nouns for resources (`/products`, `/categories`)
- Use nested routes for relationships (`/categories/:id/products`)
- Return appropriate status codes

### Response Format
```typescript
// Success Response
{
  "data": {...},
  "message": "Success message"
}

// Paginated Response
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}

// Error Response
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Authentication
- JWT tokens in Authorization header: `Bearer <token>`
- Public endpoints marked with `@Public()` decorator
- Protected endpoints use `@UseGuards(JwtAuthGuard)`

## Security Best Practices

1. **Input Validation**: All DTOs use class-validator
2. **SQL Injection**: TypeORM parameterized queries
3. **XSS Protection**: Input sanitization
4. **CORS**: Configured for frontend origin only
5. **Rate Limiting**: To be implemented
6. **Helmet**: Security headers (to be added)

## Performance Optimization

1. **Database Indexing**: On frequently queried fields
2. **Eager/Lazy Loading**: Optimized relations loading
3. **Caching**: Redis integration (planned)
4. **Pagination**: All list endpoints support pagination
5. **Query Optimization**: Select only needed fields

## Testing Strategy

1. **Unit Tests**: Service layer logic
2. **Integration Tests**: Controller + Service
3. **E2E Tests**: Full API endpoint testing
4. **Coverage Target**: 80%+

## Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker (Planned)
```bash
docker-compose up -d
```

## Monitoring & Logging

- **Logging**: Winston logger (to be added)
- **Monitoring**: Health check endpoint at `/api/health`
- **Error Tracking**: Sentry integration (planned)

## Next Steps

1. Implement Authentication module
2. Implement Users module with seeding
3. Implement Categories module
4. Implement Products module
5. Implement Blog module
6. Implement Applications module
7. Implement Telegram bot
8. Add Redis caching
9. Add rate limiting
10. Add comprehensive testing

