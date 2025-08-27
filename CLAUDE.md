# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.6 project using the App Router, TypeScript, and Tailwind CSS v4. The project uses Bun as the package manager and runtime, with shadcn/ui components configured for UI development.

## Development Commands

Use these commands to work with the codebase:

- `bun dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `bun run build` - Create production build
- `bun start` - Start production server
- `bun run lint` - Run Next.js ESLint checks

## Architecture & Structure

### Framework Stack
- **Next.js 15** with App Router architecture
- **React 19** with TypeScript
- **Tailwind CSS v4** with PostCSS integration
- **shadcn/ui** components (New York style with Lucide icons)

### Key Dependencies
- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - CSS class utilities (combined in `@/lib/utils`)
- `lucide-react` - Icon library
- `tw-animate-css` - Animation utilities

### Directory Structure
```
app/                 # Next.js App Router pages and layouts
├── globals.css      # Global styles with CSS variables and dark mode
├── layout.tsx       # Root layout with Geist fonts
└── page.tsx         # Homepage

lib/
└── utils.ts         # Utility functions (cn helper for class merging)

components.json      # shadcn/ui configuration
```

### Styling System
- Uses CSS custom properties for theming (light/dark mode)
- Tailwind v4 inline theme configuration in globals.css
- Geist Sans and Geist Mono fonts from next/font/google
- Custom variant system with `@custom-variant dark (&:is(.dark *))`

### Component Development
- shadcn/ui components use path aliases: `@/components`, `@/lib`, `@/ui`
- Component variants managed with `class-variance-authority`
- All styling follows New York variant conventions
- Icons from Lucide React library

## Configuration Notes

### Package Manager
- **Use Bun** for all package management and script execution
- `bun.lock` is the source of truth for dependencies
- Ignore warnings about multiple lockfiles (package-lock.json exists but bun.lock takes precedence)

### TypeScript
- Strict mode enabled with ES2017 target
- Path mapping configured: `@/*` maps to root directory
- Includes Next.js plugin for enhanced TypeScript support

### Tailwind CSS
- v4 configuration uses inline theme in globals.css instead of separate config file
- PostCSS plugin setup in postcss.config.mjs
- CSS variables enabled for dynamic theming