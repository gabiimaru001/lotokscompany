# Lotoks Website - Agent Instructions

## Project Overview
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (using `@theme` in globals.css)
- **State Management**: Zustand (`/src/store/auth.ts`)
- **Build**: `npm run build` (Turbopack)
- **Dev**: `npm run dev`

## Key Commands
```bash
npm run dev      # Start development server
npm run build    # Production build (includes type check)
npm run lint     # ESLint check
```

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Landing page
│   ├── dashboard/       # User dashboard
│   ├── admin/           # Admin panel (queue, listings, payments, staff, config, languages)
│   ├── login/           # Auth with preview login
│   ├── apply/           # Application wizard
│   ├── eligibility/     # Eligibility quiz
│   ├── opportunities/    # Job/education listings
│   ├── documents/       # User documents
│   └── payment/          # Payment page
├── components/          # Reusable UI components
│   ├── Navigation.tsx    # Sidebar, mobile menu, tab bar
│   └── Hero3D.tsx       # 3D hero section with Three.js
├── store/               # Zustand state
│   └── auth.ts          # Auth store (preview login)
├── hooks/               # Custom React hooks
└── types/               # TypeScript declarations
```

## Important Notes

### Authentication
- Preview login bypasses real auth: use `/login` page buttons for "Preview User Dashboard" or "Preview Admin Panel"
- Auth state managed via Zustand (`useAuthStore`)

### Routing
- User dashboard at `/dashboard`
- Admin panel at `/admin/*` (queue, listings, payments, staff, config, languages)
- Mobile navigation via hamburger menu (MobileMenu component)

### Tailwind CSS v4
- Theme tokens defined in `/src/app/globals.css` under `@theme`
- Custom colors: `navy`, `gold`, `teal`, `red` plus existing primary/secondary/tertiary
- Use `@apply` sparingly; prefer utility classes directly

### Known Issues Fixed
- three.js v0.162+ uses `colorSpace={THREE.SRGBColorSpace}` instead of deprecated `encoding={THREE.sRGBEncoding}`
- React 19 + @react-three/fiber v9 required for compatibility
- R3F JSX types may need `@ts-ignore` workaround in Next.js type system

### Brand Colors (in globals.css)
```css
--color-navy: #0B1D3A
--color-gold: #C9A44B
--color-teal: #1D7A7A
--color-red: #D14B4B
```

## Testing Changes
After any code change, run:
```bash
npm run build
```
This compiles and runs full TypeScript type checking. Build must pass before considering changes complete.