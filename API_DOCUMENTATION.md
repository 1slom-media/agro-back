# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Auth Endpoints

#### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "islom_01",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "islom_01",
    "email": "admin@agrovolokno.uz",
    "role": "admin"
  }
}
```

#### POST /api/auth/register
Register a new user (protected).

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### GET /api/auth/profile
Get current user profile (protected).

**Response:**
```json
{
  "id": "uuid",
  "username": "islom_01",
  "email": "admin@agrovolokno.uz",
  "role": "admin",
  "isActive": true
}
```

## Categories

### GET /api/categories
Get all categories with pagination (public).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": {
        "uz": "Kategoriya nomi",
        "ru": "Название категории",
        "en": "Category name"
      },
      "description": {
        "uz": "Tavsif",
        "ru": "Описание",
        "en": "Description"
      },
      "slug": "category-slug",
      "isActive": true,
      "order": 0,
      "createdAt": "2024-01-12T10:00:00.000Z",
      "updatedAt": "2024-01-12T10:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### GET /api/categories/:id
Get category by ID (public).

### GET /api/categories/slug/:slug
Get category by slug (public).

### POST /api/categories
Create a new category (protected).

**Request Body:**
```json
{
  "name": {
    "uz": "Kategoriya nomi",
    "ru": "Название категории",
    "en": "Category name"
  },
  "description": {
    "uz": "Tavsif",
    "ru": "Описание",
    "en": "Description"
  },
  "slug": "category-slug",
  "isActive": true,
  "order": 0
}
```

### PATCH /api/categories/:id
Update a category (protected).

### DELETE /api/categories/:id
Delete a category (protected).

## Products

### GET /api/products
Get all products with pagination (public).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### GET /api/products/:id
Get product by ID (public).

### GET /api/products/slug/:slug
Get product by slug (public).

### GET /api/products/category/:categoryId
Get products by category (public).

### POST /api/products
Create a new product (protected).

**Request Body:**
```json
{
  "name": {
    "uz": "Mahsulot nomi",
    "ru": "Название продукта",
    "en": "Product name"
  },
  "description": {
    "uz": "Tavsif",
    "ru": "Описание",
    "en": "Description"
  },
  "slug": "product-slug",
  "price": 100.50,
  "imageBase64": "data:image/png;base64,...",
  "specifications": {
    "temperature": "10_to_20",
    "density": "30",
    "width": "3.2"
  },
  "categoryId": "category-uuid",
  "isActive": true,
  "isFeatured": false,
  "order": 0,
  "tags": ["tag1", "tag2"]
}
```

### PATCH /api/products/:id
Update a product (protected).

### DELETE /api/products/:id
Delete a product (protected).

## Blog

### GET /api/blog
Get all published blog posts with pagination (public).

### GET /api/blog/:id
Get blog post by ID (public).

### GET /api/blog/slug/:slug
Get blog post by slug (public).

### POST /api/blog
Create a new blog post (protected).

**Request Body:**
```json
{
  "title": {
    "uz": "Maqola sarlavhasi",
    "ru": "Заголовок статьи",
    "en": "Article title"
  },
  "content": {
    "uz": "Maqola matni",
    "ru": "Текст статьи",
    "en": "Article content"
  },
  "excerpt": {
    "uz": "Qisqacha",
    "ru": "Краткое описание",
    "en": "Excerpt"
  },
  "slug": "article-slug",
  "featuredImageBase64": "data:image/png;base64,...",
  "seo": {
    "metaTitle": {
      "uz": "SEO sarlavha",
      "ru": "SEO заголовок",
      "en": "SEO title"
    },
    "metaDescription": {
      "uz": "SEO tavsif",
      "ru": "SEO описание",
      "en": "SEO description"
    },
    "keywords": ["keyword1", "keyword2"]
  },
  "tags": ["tag1", "tag2"],
  "isPublished": true,
  "publishedAt": "2024-01-12T10:00:00.000Z"
}
```

### PATCH /api/blog/:id
Update a blog post (protected).

### DELETE /api/blog/:id
Delete a blog post (protected).

## Applications

### POST /api/applications
Submit a new application (public).

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+998901234567",
  "email": "john@example.com",
  "message": "I'm interested in your products",
  "type": "contact",
  "metadata": {
    "productId": "product-uuid",
    "source": "website"
  }
}
```

### GET /api/applications
Get all applications with pagination (protected).

### GET /api/applications/stats
Get application statistics (protected).

**Response:**
```json
{
  "total": 100,
  "new": 10,
  "inProgress": 20,
  "completed": 65,
  "unread": 15
}
```

### GET /api/applications/:id
Get application by ID (protected).

### PATCH /api/applications/:id
Update application status (protected).

**Request Body:**
```json
{
  "status": "in_progress",
  "adminNotes": "Contacted customer",
  "isRead": true
}
```

### DELETE /api/applications/:id
Delete an application (protected).

## Dictionary

### GET /api/dictionary/filters
Get all filter options (public).

**Response:**
```json
{
  "temperature": [...],
  "density": [...],
  "width": [...],
  "length": [...]
}
```

### GET /api/dictionary/temperature
Get temperature filter options (public).

### GET /api/dictionary/density
Get density filter options (public).

### GET /api/dictionary/width
Get width filter options (public).

### GET /api/dictionary/length
Get length filter options (public).

## Health Check

### GET /api/health
Check server health (public).

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-12T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

