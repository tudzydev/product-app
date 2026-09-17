# ProductHub - Frontend Application

A modern, responsive Product and Inventory Management frontend application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **daisyUI 5**.

---

## 🎨 UI & Features

- **Component Library**: DaisyUI 5 integrated directly with Tailwind CSS v4 (`@plugin "daisyui"`).
- **Responsive Layout**: Fluid design supporting mobile, tablet, and desktop viewports.
- **Theme Support**: Seamless light and dark mode toggling using DaisyUI `data-theme`.
- **Live Inventory Analytics**:
  - Total catalog products and active status
  - Stock availability (in stock vs out of stock alerts)
  - Total inventory units count
  - Real-time valuation ($) & average product price
- **Interactive Search & Filtering**:
  - Debounced keyword search across product name, description, and SKU
  - Category pill filter with product counts per category
  - Stock level filter (In Stock Only, Out of Stock)
  - Product active status filter
  - Min and Max price range filtering
  - Multi-column sorting (Newest, Oldest, Price Low/High, Name A-Z, Stock Level)
- **Dual View Modes**:
  - **Grid Card View**: Visual cards with product images, badges, tags, and quick actions.
  - **Table View**: Compact zebra-striped table view for bulk inventory reviews.
- **Product Management Modals**:
  - **Create / Edit Modal**: Form inputs with client-side validation and live image URL preview.
  - **Quick Details Modal**: Full specification sheet, timestamp history, and calculated line values.
  - **Delete Confirmation Modal**: Protective modal preventing accidental product deletions.
- **Feedback & Notifications**:
  - Floating DaisyUI Toast alerts for success, error, and information messages.
  - Real-time backend status indicator (`API Connected` / `API Offline`) with fallback warnings.
- **One-Click Catalog Seeding**:
  - Seed button in the navigation bar to automatically populate sample catalog items.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Environment Configuration

Ensure `.env.local` exists (default provided):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Architecture & File Structure

```
frontend/
├── app/
│   ├── globals.css            # Tailwind CSS v4 & DaisyUI 5 plugin imports
│   ├── layout.tsx             # Root layout with DaisyUI theme provider and fonts
│   └── page.tsx               # Main Dashboard page coordinating state and modals
├── components/
│   ├── DeleteConfirmModal.tsx # Delete confirmation dialog
│   ├── FilterBar.tsx          # Search, category pills, advanced filters & view toggles
│   ├── Navbar.tsx             # Top bar with logo, status badge, theme toggle & actions
│   ├── Pagination.tsx         # Page navigation and row size selector
│   ├── ProductCard.tsx        # Card component for grid view with image fallback
│   ├── ProductDetailsModal.tsx# Detailed inspection modal with specs and valuation
│   ├── ProductModal.tsx       # Create & edit modal with validation and image preview
│   ├── ProductTable.tsx       # DaisyUI zebra table for list view
│   ├── StatsSection.tsx       # DaisyUI metric statistics cards
│   └── Toast.tsx              # DaisyUI toast notification system
├── services/
│   └── api.ts                 # Type-safe API client connecting to the backend
├── types/
│   └── product.ts             # TypeScript interfaces for products, filters, and responses
├── Dockerfile                 # Containerization setup with pnpm
└── next.config.ts             # Next.js configuration
```
