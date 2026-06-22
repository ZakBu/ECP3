# HomePage Decomposition Plan

## Goal
Reduce orchestration complexity in `src/pages/HomePage/HomePage.tsx` by separating page controller concerns from presentational blocks.

## Current decomposition applied

- Extracted responsive canvas sizing into `src/pages/HomePage/hooks/useDashboardCanvasSize.ts`.
- Extracted page-only UI state (drag session, context menu, resize preview) into
  `src/pages/HomePage/hooks/useHomePageUiState.ts`.
- Extracted context menu rendering into
  `src/pages/HomePage/components/WidgetContextMenu.tsx`.

## Target container/presenter interfaces

### `useHomePageUiState(activeLayout)`
- Inputs:
  - `activeLayout: LayoutItem[]`
- Outputs:
  - `draggingLibraryWidget`, `selectedWidgetItem`, `widgetResizePreview`, `widgetContextMenuAnchor`
  - UI actions: `beginLibraryDrag`, `endLibraryDrag`, `openWidgetMenu`, `closeWidgetMenu`, `setWidgetResizePreview`

### `WidgetContextMenu`
- Inputs:
  - selected widget metadata
  - size options and resize resolver
  - callbacks for preview/apply/delete/close/message
- Output:
  - presentational popover only, no data fetching or store writes.

## Next decomposition increments

1. Extract `DashboardCanvas` component for edit/view rendering branches.
2. Move drag/drop pointer tracking into `useLibraryDragDrop` hook.
3. Keep `HomePage` as page composition shell + wiring only.
