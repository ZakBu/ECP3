# Prototype Artifacts Policy

## Problem

Repository contains production SPA code (`src/`) and legacy standalone prototype HTML files.
Without explicit separation this creates confusion about source of truth.

## Policy

- `src/` is the only production implementation path.
- Standalone prototype HTML files are reference artifacts only and are stored in `docs/archive/prototypes/`.
- New feature work must not be implemented in prototype HTML files.

## Maintenance rules

1. Keep prototype files in `docs/archive/prototypes/` for historical reference until explicit removal decision.
2. When behavior diverges between prototype and app, app (`src/`) wins.
3. Any visual parity work should be ported from prototype into typed React components.

## Archived prototype files

- `docs/archive/prototypes/widgets.html`
- `docs/archive/prototypes/ecp_widgets_v2.html`
- `docs/archive/prototypes/ecp_widgets_v6.html`
- `docs/archive/prototypes/ecp-widget-library-v7.html`
