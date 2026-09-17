# Product App - Backend API

A RESTful backend service built with **Express 5**, **TypeScript**, **Sequelize ORM**, and **PostgreSQL**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize v6
- **Development Tooling**: `tsx` (TypeScript Execute & Watch)
- **Containerization**: Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env` file in the `backend/` directory (or use `.env.example`):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=product_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_LOGGING=false
```

### 2. Running with Docker Compose (Recommended)

From the project root:

```bash
docker compose up --build
```

This will start both the PostgreSQL database (`product-db`) and the backend API container (`product-backend`).

### 3. Running Locally (without Docker)

Ensure a PostgreSQL instance is running with the credentials in your `.env`, then run:

```bash
cd backend
npm install
npm run dev
```

### 4. Database Seeding

To populate the database with realistic demo products:

```bash
# Via npm script:
npm run seed

# Or via API request:
curl -X POST http://localhost:5000/api/products/seed
```

---

## 📚 API Reference

Base URL: `http://localhost:5000/api`

### Health Check

#### `GET /api/health`
Checks server uptime and database connectivity status.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 12.34,
  "timestamp": "2026-09-17T15:00:00.000Z"
}
```

---

### Products API

#### 1. List Products (with Search, Filter, Sort & Pagination)
`GET /api/products`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | `""` | Search term in `name`, `description`, or `sku` (case-insensitive) |
| `category`| string | - | Filter by exact category |
| `minPrice`| number | - | Minimum price filter |
| `maxPrice`| number | - | Maximum price filter |
| `inStock` | boolean | - | `true` for stock > 0, `false` for out of stock |
| `isActive`| boolean | - | Filter active (`true`) or inactive (`false`) products |
| `sortBy` | string | `createdAt` | Field to sort by (`id`, `name`, `price`, `stock`, `category`, `createdAt`, `updatedAt`) |
| `order` | string | `DESC` | Sort direction: `ASC` or `DESC` |
| `page` | integer| `1` | Page number |
| `limit` | integer| `10` | Items per page (max 100) |

**Example Request:**
```bash
curl "http://localhost:5000/api/products?search=wireless&category=Electronics&sortBy=price&order=ASC&page=1&limit=10"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Noise-Canceling Headphones",
      "description": "Premium over-ear headphones with active noise cancellation...",
      "price": 199.99,
      "category": "Electronics",
      "stock": 45,
      "imageUrl": "https://images.unsplash.com/...",
      "sku": "ELEC-HP-001",
      "isActive": true,
      "createdAt": "2026-09-17T15:00:00.000Z",
      "updatedAt": "2026-09-17T15:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

#### 2. Get Single Product by ID
`GET /api/products/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Noise-Canceling Headphones",
    "description": "...",
    "price": 199.99,
    "category": "Electronics",
    "stock": 45,
    "imageUrl": "https://images.unsplash.com/...",
    "sku": "ELEC-HP-001",
    "isActive": true,
    "createdAt": "2026-09-17T15:00:00.000Z",
    "updatedAt": "2026-09-17T15:00:00.000Z"
  }
}
```

---

#### 3. Create Product
`POST /api/products`

**Request Body:**
```json
{
  "name": "Wireless Mechanical Numpad",
  "description": "Bluetooth and 2.4GHz wireless mechanical keypad with Gateron switches",
  "price": 49.99,
  "category": "Electronics",
  "stock": 25,
  "imageUrl": "https://images.unsplash.com/photo-...",
  "sku": "ELEC-NP-004",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 13,
    "name": "Wireless Mechanical Numpad",
    "price": 49.99,
    ...
  }
}
```

---

#### 4. Update Product
`PUT /api/products/:id` or `PATCH /api/products/:id`

**Request Body:**
```json
{
  "price": 179.99,
  "stock": 50
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

---

#### 5. Delete Product
`DELETE /api/products/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product with ID 1 deleted successfully"
}
```

---

#### 6. Get Categories Summary
`GET /api/products/categories`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "category": "Apparel", "productCount": 2 },
    { "category": "Books", "productCount": 2 },
    { "category": "Electronics", "productCount": 3 },
    { "category": "Furniture", "productCount": 2 },
    { "category": "Home", "productCount": 1 },
    { "category": "Kitchen", "productCount": 2 }
  ]
}
```

---

#### 7. Get Product & Inventory Statistics
`GET /api/products/stats`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "activeProducts": 12,
    "inStock": 11,
    "outOfStock": 1,
    "totalUnits": 507,
    "totalInventoryValue": 53429.50,
    "averagePrice": 145.87
  }
}
```

---

#### 8. Seed Database
`POST /api/products/seed`

**Request Body (optional):**
```json
{
  "force": true
}
```
*Note: If `force: false` or omitted, it only seeds if the table is currently empty.*

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # Sequelize connection, pool & retry configuration
│   ├── controllers/
│   │   └── product.controller.ts # CRUD, search, stats, category & seed handlers
│   ├── middleware/
│   │   ├── errorHandler.ts     # Global error and 404 handlers
│   │   └── validator.ts        # Request payload & parameter validators
│   ├── models/
│   │   ├── index.ts            # Central models export
│   │   └── product.model.ts    # Product Sequelize model definition & TypeScript typing
│   ├── routes/
│   │   ├── index.ts            # Central API router
│   │   └── product.routes.ts   # Product routes (/api/products)
│   ├── seeders/
│   │   └── product.seeder.ts   # Realistic sample product catalog data
│   ├── seed.ts                 # Standalone seeding script
│   └── server.ts               # Express application entrypoint
├── Dockerfile                  # Container image build configuration
├── package.json
└── tsconfig.json
```
