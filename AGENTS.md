# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with domain modules under `src/modules/{authentication,dashboard,location,payments,profile,trips}`.
- Navigation: `src/navigation/` (`AppNavigator.tsx`) wires stacks and tabs.
- Shared: `src/shared/{components,utils,types,img}` for reusable UI and helpers.
- Entry points: `App.tsx` (Expo), package `main` is `index.ts` re-exporting module APIs.
- Assets: `assets/` (icons, splash). No native folders committed; Expo manages builds.

## Build, Test, and Development Commands
- `npm run start`: Launch Expo dev server (QR for Expo Go, web preview).
- `npm run android`: Start on Android emulator/device via Expo.
- `npm run ios`: Start on iOS simulator/device via Expo (macOS required).
- `npm run web`: Run in a web browser via React Native Web.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict` mode via `tsconfig.json`).
- Indentation: 2 spaces; prefer named exports and module barrel files (`index.ts`).
- Components: PascalCase filenames (e.g., `DashboardScreen.tsx`), hooks/use- files in camelCase.
- Imports: Use relative paths within `src/`; group shared items under `src/shared`.
- UI: Keep navigation titles, icons, and header styles consistent with `AppNavigator.tsx`.

## Testing Guidelines
- Current status: No test suite or script defined.
- Recommendation: Add Jest + React Native Testing Library.
  - Place tests alongside files or under `__tests__/` using `*.test.ts(x)`.
  - Example script: `"test": "jest"` in `package.json`.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits used in history
  - Examples: `feat(map): add interactive map`, `fix(auth): correct login flow`, `refactor(navigation): hide tab bar`.
- Pull requests must include:
  - Clear description of changes and rationale.
  - Linked issue(s) (e.g., `Closes #123`).
  - Screenshots or short clips for UI changes (tabs, headers, maps).
  - Checklist: builds locally via `npm run start` and no TypeScript errors.

## Security & Configuration Tips
- Do not commit secrets. Environment files like `.env*.local` are gitignored.
- For keys/config, prefer Expo config/env and access via runtime constants.
- Keep dependencies aligned with Expo SDK version in `package.json`.

## Architecture Overview
- Modular, feature-first structure with a single `NavigationContainer`.
- Tabs for `Dashboard`, `Trips`, `Location`, `Payments`, `Profile`; map features in `location` module.
