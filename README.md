# Fullstack Product Application (ProductHub)

A fullstack e-commerce catalog and inventory management application built with **Next.js 16**, **Tailwind CSS v4**, **daisyUI 5**, **Express 5**, **TypeScript**, **Sequelize ORM**, and **PostgreSQL**.

---

## 🏗️ Architecture Overview

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, daisyUI 5, Lucide Icons.
- **Backend**: Express 5, TypeScript, Sequelize ORM v6, RESTful API.
- **Database**: PostgreSQL 15.
- **DevOps**: Docker & Docker Compose.

---

## ⚡ Quick Start with Docker Compose

Run the entire stack (PostgreSQL, Backend API, and Next.js Frontend) with a single command:

```bash
docker compose up --build
```

- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
- **PostgreSQL**: `localhost:5433` (mapped from 5432)

> 📖 **Complete Documentation**: For a comprehensive tutorial on creating, structuring, and configuring the backend and frontend from scratch, see [SETUP_GUIDE.md](file:///Users/mac/Desktop/workspace/product-app/SETUP_GUIDE.md).

---

## 💻 Manual Local Development

### 1. Start PostgreSQL
Ensure PostgreSQL is running locally with database `product_db` (or run only the DB via Docker):

```bash
docker compose up product-db -d
```

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
To seed demo products into the database:
```bash
npm run seed
```

### 3. Run Frontend
```bash
cd frontend
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Features

1. **Dashboard Analytics**: Real-time stats on total products, stock levels, out-of-stock items, total units, and inventory valuation.
2. **Interactive Catalog**:
   - Debounced keyword search (name, description, SKU).
   - Category filtering with badge counters.
   - Price range, stock status, and active/inactive filters.
   - Multi-column sorting (price, newest, stock, name).
   - Grid View & Table View toggles.
3. **Product CRUD**:
   - Create products with client/server validation and live image previews.
   - Edit product details, stock, SKU, and active status.
   - Detailed product view modal with line-item valuation.
   - Delete confirmation dialog.
4. **Theming**:
   - Dynamic light and dark mode toggling using DaisyUI themes.
5. **Connectivity Resilience**:
   - Visual backend health badge with offline notifications and auto-reconnect.
