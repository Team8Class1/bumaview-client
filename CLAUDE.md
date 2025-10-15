# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BumaView is a Korean interview management and practice web application built with Next.js 15. The client provides user authentication, interview management, bookmarks, groups, and admin functionality for company management.

## Essential Development Commands

### Development & Build
```bash
bun dev                    # Start development server with Turbopack
bun run build             # Build for production with Turbopack
bun run start             # Start production server
```

### Code Quality (Required before commits)
```bash
bun run lint              # Check code with Biome
bun run lint:fix          # Auto-fix linting issues
bun run format            # Format code with Biome
```

## Technology Stack

- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **State**: Zustand (client) + TanStack React Query v5 (server)
- **Forms**: React Hook Form + Zod validation
- **HTTP**: ky client with JWT authentication
- **Tools**: Biome for linting/formatting, Bun for package management

## Architecture & Key Patterns

### API Architecture
- Modular API clients in `src/lib/api/` (auth, interview, bookmark, etc.)
- Centralized HTTP client with automatic JWT token handling
- Custom `ApiError` class for error handling
- Mock mode support via `NEXT_PUBLIC_USE_MOCK` environment variable

### Authentication & Authorization
- JWT bearer token authentication with Zustand persistence
- Next.js middleware for route protection (`src/middleware.ts`)
- Role-based access: admin users can access `/admin/*` routes
- Auto-logout on 401 responses

### State Management
- **Server state**: React Query with 1-minute stale time, 1 retry
- **Client state**: Zustand store for authentication with localStorage persistence
- **Forms**: React Hook Form with Zod schema validation

### Component Structure
```
src/components/
├── ui/           # shadcn/ui components with Radix primitives
├── auth/         # Authentication-related components
├── layout/       # Header, Footer components
└── interview/    # Interview-specific components
```

## Development Guidelines

### Code Style
- **Indentation**: 2 spaces (enforced by Biome)
- **Imports**: Automatic organization with path aliases (@/components, @/lib, @/hooks)
- **Naming**: PascalCase for components/interfaces, camelCase for functions/variables
- **Language**: Korean for UI text, English for code and comments

### File Organization
- Use existing patterns: check similar components before creating new ones
- API functions in domain-specific modules (`src/lib/api/[domain].ts`)
- Custom hooks with `use-*` prefix in `src/hooks/`
- TypeScript interfaces co-located with implementations

### Quality Requirements
- All Biome lint checks must pass (`bun run lint`)
- TypeScript compilation must succeed with no errors
- Production build must complete successfully (`bun run build`)
- Follow existing component and API patterns

## Environment Setup

The project supports mock mode for development without a backend:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true  # Enable mock API responses
NEXT_PUBLIC_API_URL=your-backend-url  # When connecting to real backend
```

Mock mode provides realistic delays and always-successful authentication (use "admin" as ID for admin role).

## Common Patterns

### Adding New API Endpoints
1. Create/extend API module in `src/lib/api/[domain].ts`
2. Export from `src/lib/api.ts`
3. Create React Query hook in `src/hooks/use-[domain]-queries.ts`
4. Follow existing error handling patterns

### Creating New Pages
1. Add to `src/app/` following App Router conventions
2. Use existing layout system (Header/Footer automatically included)
3. Implement authentication checks if needed
4. Follow responsive design patterns with Tailwind

### Form Components
1. Use React Hook Form with Zod validation
2. Leverage existing form components from `src/components/ui/`
3. Follow existing validation patterns in similar forms