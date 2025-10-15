# BumaView Client - Technology Stack

## Core Framework
- **Next.js 15.5.4** with App Router
- **React 19.1.0** with React DOM 19.1.0
- **TypeScript 5** for type safety
- **Turbopack** for development and build (--turbopack flag)

## Styling & UI
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (New York style)
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **next-themes** for dark/light mode support
- **class-variance-authority** and **clsx** for conditional styling

## State Management & Data Fetching
- **Zustand** for client state (auth store with persistence)
- **TanStack React Query v5** for server state and caching
- **React Hook Form** with **@hookform/resolvers** for form handling
- **Zod v4** for schema validation

## HTTP & API
- **ky** HTTP client for API requests
- Custom API client with JWT token handling
- Mock mode support for development

## Development Tools
- **Biome** for linting, formatting, and code quality
- **Bun** as package manager and development runtime
- **Vercel** for deployment

## Key Dependencies
- @tanstack/react-query-devtools for debugging
- tw-animate-css for animations
- Custom validation and API abstraction layers