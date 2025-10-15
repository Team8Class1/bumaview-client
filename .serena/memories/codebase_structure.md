# BumaView Client - Codebase Structure

## Project Architecture
```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Home page
│   ├── login/          # Authentication pages
│   ├── register/
│   ├── interview/      # Interview management
│   │   ├── [id]/       # Dynamic interview pages
│   │   ├── create/     # Create interview
│   │   ├── upload/     # Upload interviews
│   │   └── all/        # All interviews view
│   ├── group/          # Group management
│   ├── bookmark/       # Bookmark functionality
│   └── admin/          # Admin-only pages
├── components/         # Reusable React components
│   ├── ui/            # shadcn/ui components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components (Header, Footer)
│   └── interview/     # Interview-specific components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── api/           # API client modules
│   ├── utils/         # Utility functions
│   └── providers.tsx  # React providers (Query, Theme)
├── stores/            # Zustand state stores
└── types/             # TypeScript type definitions
```

## Key Architectural Patterns

### API Architecture
- **Modular API**: Each domain (auth, interview, bookmark, etc.) has separate API module
- **Centralized HTTP**: Single ky-based client with JWT token handling
- **Type Safety**: TypeScript interfaces for all API requests/responses

### State Management
- **Server State**: TanStack React Query for API data
- **Client State**: Zustand for authentication and UI state
- **Persistence**: Auth state persisted to localStorage

### Authentication Flow
- **JWT Tokens**: Bearer token authentication
- **Middleware**: Next.js middleware for route protection
- **Role-based Access**: Admin vs regular user permissions
- **Auto-logout**: 401 responses trigger automatic logout

### Component Architecture
- **UI Components**: shadcn/ui with Radix primitives
- **Layout System**: Centralized layout with responsive design
- **Form Handling**: React Hook Form with Zod validation
- **Custom Hooks**: Domain-specific hooks for queries and mutations