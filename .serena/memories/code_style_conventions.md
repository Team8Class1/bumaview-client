# BumaView Client - Code Style & Conventions

## Code Formatting (Biome Configuration)
- **Indentation**: 2 spaces (not tabs)
- **Formatter**: Biome with recommended rules
- **Import organization**: Automatic import sorting enabled
- **VCS integration**: Git-aware formatting

## TypeScript Conventions
- **Strict TypeScript**: Full type safety required
- **Interface definitions**: Separate interface files in appropriate modules
- **Type exports**: Export types alongside implementation
- **Naming**: PascalCase for interfaces, camelCase for variables/functions

## React/Next.js Patterns
- **App Router**: Using Next.js 15 App Router structure
- **Client Components**: Explicit "use client" directive when needed
- **Server Components**: Default server components pattern
- **Layout system**: Centralized layout with Header/Footer components

## File Organization
- **Path aliases**: @/ for src directory, @/components, @/lib, @/hooks
- **API structure**: Modular API files in src/lib/api/
- **Component structure**: UI components in src/components/ui/
- **Custom hooks**: Centralized in src/hooks/ with descriptive names

## State Management Patterns
- **Zustand stores**: Persistent auth store with middleware
- **React Query**: Server state with 1-minute stale time, 1 retry
- **Form handling**: React Hook Form with Zod validation
- **Error handling**: Custom ApiError class with status codes

## Naming Conventions
- **Files**: kebab-case for file names
- **Components**: PascalCase for React components
- **Hooks**: use-* prefix for custom hooks
- **API functions**: camelCase with descriptive verbs
- **Types/Interfaces**: PascalCase with descriptive names

## Language
- **Korean UI**: Interface in Korean (lang="ko")
- **English code**: Comments and code in English
- **Mixed content**: Korean user-facing text, English technical terms