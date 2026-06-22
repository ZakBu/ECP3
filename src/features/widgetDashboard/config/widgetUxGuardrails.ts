export const WIDGET_UX_GUARDRAILS = {
  minTouchTarget: 44,
  borderRadius: 16,
  cardPadding: 12,
  titleLineClamp: 2,
  maxAccentCount: 2,
  focusRingWidth: 2,
  focusRingColor: "#005FCC",
  sectionGap: 12,
  cardShadow:
    "0px 1px 3px 0px rgba(15, 23, 42, 0.16), 0px 1px 2px 0px rgba(15, 23, 42, 0.28)",
} as const;

export const REQUIRED_WIDGET_STATES = ["loading", "ready", "empty", "error"] as const;
