# ADR: Widget Dashboard Architecture Boundaries

## Status
Accepted

## Context

The dashboard implementation is functionally rich, but core responsibilities are currently mixed:
- page orchestration and UI ephemeral behavior live together with domain operations;
- persistence and mock storage live in one API module;
- feature growth increases coupling around `HomePage`.

This ADR formalizes boundaries for the current architecture and for upcoming refactors.

## Decision

Use a four-layer architecture with strict responsibility ownership:

1. **App layer**
   - Entrypoints, theme wiring, top-level composition.
   - Files: `src/main.tsx`, `src/App.tsx`.

2. **Page/UI layer**
   - Visual composition, local interaction state, view-specific hooks.
   - Files: `src/pages/HomePage/*`.
   - Allowed to call domain APIs/hooks, but must not implement persistence details.

3. **Feature/Domain layer (`widgetDashboard`)**
   - Layout rules, role/preset rules, typed contracts, domain store for business state.
   - Files: `src/features/widgetDashboard/{config,store,types,components/widgets}`.
   - Should remain independent from page-only UI concerns like popover anchors and transient drag previews.

4. **Data layer**
   - Transport/repository logic and environment-specific storage.
   - Files: `src/features/widgetDashboard/api/*`.
   - Split by concern:
     - HTTP client (REST transport),
     - mock repository (memory/localStorage),
     - facade service (runtime selection and migration flow).

## Ownership Matrix

| Concern | Layer | Primary location |
|---|---|---|
| Grid sizing constraints and allowed dimensions | Feature/Domain | `config/widgetSizing.ts` |
| Edit workflow (`persisted` vs `draft`) | Feature/Domain | `store/dashboardStore.ts` |
| Context menu anchor position and preview highlight | Page/UI | `pages/HomePage` hooks/state |
| Dragging from widget library | Page/UI | `pages/HomePage` hooks/state |
| Loading/saving/resetting dashboard config | Data + Domain integration hook | `api/*`, `hooks/useDashboardConfig.ts` |
| Theme tokens and MUI integration | App | `theme/*`, `main.tsx` |

## Consequences

### Positive
- Lower coupling in `HomePage`.
- Clearer test seams by layer.
- Easier replacement of mock storage with backend-only mode.

### Trade-offs
- More modules and explicit interfaces.
- Slightly more boilerplate for dependency boundaries.

## Guardrails

- `store/dashboardStore.ts` must keep domain state only.
- Page-specific local UI state should stay in `pages/HomePage` hooks.
- Data transport and mock persistence should not be mixed in one module.
- New feature additions must declare target layer first.
