# BumaView Client - Essential Development Commands

## Development Server
```bash
bun dev                    # Start development server with Turbopack
```
- Runs on http://localhost:3000
- Hot reload enabled
- Turbopack for fast builds

## Build & Production
```bash
bun run build            # Build for production with Turbopack
bun run start             # Start production server
```

## Code Quality & Linting
```bash
bun run lint              # Check code with Biome (biome check)
bun run lint:fix          # Auto-fix linting issues (biome check --write)
bun run lint:fix-us       # Auto-fix with unsafe transformations
bun run format            # Format code (biome format --write)
```

## Package Management
```bash
bun install              # Install dependencies
bun add <package>         # Add new dependency
bun add -d <package>      # Add dev dependency
```

## Environment Setup
```bash
cp .env.example .env.local  # Create local environment file (if .env.example exists)
```

## Git Workflow
```bash
git status                # Check current branch and status
git checkout -b feat/#<issue-number>  # Create feature branch (pattern: feat/#19)
```

## Testing & Validation
- No test framework currently configured
- Code validation through Biome linting and TypeScript compilation

## Development Notes
- Uses Bun as primary package manager (bun.lock present)
- Mock mode available via NEXT_PUBLIC_USE_MOCK environment variable
- Biome handles both linting and formatting (no separate Prettier/ESLint)