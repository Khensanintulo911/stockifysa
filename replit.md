# Inventory Management System

## Overview

This is a modern web-based inventory management system designed to help small and emerging businesses track products, manage stock levels, process sales, and generate reports. The application provides a comprehensive dashboard with real-time metrics, low stock alerts, and intuitive interfaces for product and sales management.

The system is built as a full-stack TypeScript application with a React frontend and Express backend, featuring a clean, responsive UI built with shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between frontend and backend
- **Storage**: In-memory storage implementation with interface for easy database integration

### Database Design
- **Schema**: PostgreSQL-compatible schema defined with Drizzle ORM
- **Tables**: Users, Products, Sales, and Stock Movements with proper relationships
- **Features**: UUID primary keys, timestamp tracking, and referential integrity

### Key Features
- **Dashboard**: Real-time metrics, low stock alerts, quick actions, and sales overview
- **Product Management**: CRUD operations with SKU validation and category organization
- **Inventory Tracking**: Stock level monitoring with automated low stock detection
- **Sales Processing**: Transaction recording with automatic inventory updates
- **Reporting**: Sales and inventory reports with export capabilities
- **Responsive Design**: Mobile-first approach with adaptive layouts

### API Structure
- RESTful endpoints following standard conventions
- Consistent error handling and response formatting
- Input validation using shared Zod schemas
- Automatic query invalidation for real-time UI updates

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid styling
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library with consistent design

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management with caching and synchronization
- **@hookform/resolvers**: Form validation integration

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

### Utility Libraries
- **date-fns**: Modern date utility library
- **nanoid**: URL-safe unique ID generator
- **clsx**: Conditional className utility
- **wouter**: Minimalist routing library for React

The architecture prioritizes type safety, developer experience, and maintainability while providing a solid foundation for scaling the application as business requirements grow.