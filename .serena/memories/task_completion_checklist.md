# BumaView Client - Task Completion Checklist

## Before Committing Changes

### 1. Code Quality Checks
```bash
bun run lint              # Check for linting errors
bun run lint:fix          # Auto-fix any fixable issues
bun run format            # Ensure consistent formatting
```

### 2. Build Verification
```bash
bun run build            # Verify production build works
```

### 3. Type Safety
```bash
bun run type-check       # (if available) or rely on IDE TypeScript checking
```

## Development Workflow

### 1. Environment Setup
- Ensure `.env.local` exists with appropriate configuration
- Verify mock mode setting (NEXT_PUBLIC_USE_MOCK) if needed
- Check API base URL configuration

### 2. Feature Development
- Follow existing patterns in similar components/pages
- Use existing hooks and API modules when possible
- Maintain TypeScript strict mode compliance
- Follow shadcn/ui component patterns

### 3. Testing Considerations
- Manual testing in development mode
- Test both authenticated and unauthenticated states
- Verify admin vs regular user access patterns
- Test mock mode vs real API integration

## Quality Standards
- **Zero linting errors**: All Biome checks must pass
- **Type safety**: No TypeScript errors or warnings
- **Build success**: Production build must complete without errors
- **Pattern consistency**: Follow existing code patterns and conventions
- **Responsive design**: Test on different screen sizes

## Git Workflow
- Use feature branch naming: `feat/#<issue-number>`
- Commit messages should be descriptive
- Ensure clean git status before task completion