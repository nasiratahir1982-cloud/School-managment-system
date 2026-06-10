# Academic Hub - Enterprise School Management ERP SaaS

This repository contains the complete ecosystem for **Academic Hub**, structured across two main deployment modes:
1. **Academic Hub WordPress Plugin**: A localized educational plugin for single-instance institute websites.
2. **Academic Hub Enterprise ERP SaaS**: A decoupled, multi-tenant educational SaaS platform designed for educational networks, colleges, and franchises.

---

## 🏢 1. Academic Hub Enterprise ERP SaaS Architecture

The enterprise-grade architecture is built on a decoupled model designed for scale (500+ schools, 100,000+ students, and 10,000+ concurrent users).

### 🚀 Tech Stack
- **Frontend SPA**: React, TypeScript, Tailwind CSS, Zustand, React Query.
- **Backend API**: Node.js, Express, TypeScript.
- **Database Layer**: PostgreSQL 16 (using Row-Level Security policies for dynamic tenant isolation).
- **Caching & Event Bus**: Redis (distributed caching & BullMQ scheduler) and RabbitMQ (async notifications).
- **Deployment**: Docker Compose orchestration & Nginx rate-limiting reverse proxy.

### 📁 Directory Layout
```
├── backend/                       # Node.js Express TypeScript API
│   ├── src/
│   │   ├── index.ts               # Core server entry & Tenant Resolution RLS middleware
│   │   ├── domain/                # Entities, Value Objects
│   │   ├── application/           # Use Cases, Command/Query handlers (CQRS)
│   │   ├── infrastructure/        # Database pool, worker queues, mailers
│   │   └── presentation/          # Routes, controllers, and schema validators (Zod)
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/                      # React TypeScript Vite SPA
│   ├── src/
│   │   ├── App.tsx                # Client Routing (Login, Admin, Student, SuperAdmin portals)
│   │   ├── main.tsx
│   │   ├── index.css              # Global tailwind base & premium glassmorphic/glow styles
│   │   ├── store/                 # Zustand state stores (authStore, tenantStore)
│   │   ├── hooks/                 # React Query queries & mutations (useStudents)
│   │   └── pages/                 # Portal dashboards
│   │       ├── Login.tsx          # Subdomain/role authentication portal
│   │       ├── admin/             # School Admin Dashboard (customizer, registry ledger)
│   │       ├── student-portal/    # Student dashboard (attendance, bills, checkout payments)
│   │       └── super-admin/       # SaaS Provisioning Dashboard (telemetry, log console)
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── database/
│   └── schema.sql                 # PostgreSQL DDL with RLS, indices, and partitions
│
├── docker-compose.yml             # Orchestrator for pg, redis, rabbitmq, backend, and nginx
└── nginx.conf                     # Nginx proxy mapping and API rate limits
```

### 🛠️ Local SaaS Development Setup
1. **Install Dependencies**:
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install --legacy-peer-deps
     ```

2. **Run Compilations**:
   - Verify backend builds successfully:
     ```bash
     cd ../backend
     npm run build
     ```
   - Verify frontend builds successfully:
     ```bash
     cd ../frontend
     npm run build
     ```

3. **Start Orchestration Container**:
   - Ensure Docker is running and execute:
     ```bash
     cd ..
     docker-compose up --build
     ```

---

## 🔌 2. Academic Hub WordPress Plugin

The WordPress directory contains the single-instance plugin assets renamed and updated to **Academic Hub / AH**.

### 📁 Files List
- `academic-hub.php` - Main plugin bootstrap loader.
- `class-ah-activator.php` - Activation routines.
- `class-ah-db.php` - Custom MySQL table setups.
- `class-ah-assets.php` - Asset enqueuing rules.
- `class-ah-ajax.php` - AJAX endpoint parameters.
- `class-ah-payments.php` - Financial gateway handling.
- `class-ah-notifications.php` - Email and SMS alerts.
- `ah-common.css` & `ah-common.js` - Global stylesheets and behaviors.

### 🛠️ WordPress Local Play
To run the WordPress dashboard playground:
```bash
npx @wp-playground/cli start
```
Go to `http://127.0.0.1:9400/wp-admin/` and navigate to the **Academic Hub** menu item to access courses, classes, fee challans, and admission reviews.