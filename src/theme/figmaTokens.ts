export const figmaTokens = {
  colors: {
    appBg: "#FAF9FD",
    pageBg: "#FAF9FD",
    surface: "#FAF9FD",
    surfaceLow: "#FFFFFF",
    surfaceVariant: "#DFE2EB",
    outline: "#D7D8D9",
    outlineStrong: "#73777F",
    textPrimary: "#1A1C1E",
    textSecondary: "#43474E",
    textMuted: "#818C99",
    primary: "#005FAD",
    primaryHover: "#0181EA",
    onPrimary: "#FFFFFF",
    accentBlue: "#D8E3F8",
    danger: "#BA1A1A",
    dangerBg: "#FCEBEC",
    success: "#1B6B3A",
    successBg: "#E8F5EE",
    warning: "#B35A00",
    warningBg: "#FFF4E5",
    infoBg: "#EDF3FB",
    draftBg: "#EDF3FB",
    publishedBg: "#E8F5EE",
    archivedBg: "#F1F2F5",
    unsavedDot: "#E5A100",
    nodeSelectedTint: "rgba(0, 95, 173, 0.02)",
    handleHover: "rgba(0, 95, 173, 0.1)",
    /** Нейтральный фон рабочей зоны визуального редактора */
    canvasWorkspace: "#FAF9FD",
    /** Палитра / плавающие панели конструктора процессов (отсылка к OpenAI Canvas) */
    processBuilderChrome: {
      panelBg: "#FFFFFF",
      panelBorder: "1px solid rgba(0, 0, 0, 0.06)",
      panelShadow: "0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
      sectionLabel: "#8E8EA0",
      itemHover: "rgba(0, 0, 0, 0.05)",
      itemText: "#212121",
      toolbarBg: "#FFFFFF",
      toolbarBorder: "1px solid rgba(0, 0, 0, 0.06)",
      toolbarShadow: "0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
      toolIcon: "#353740",
      toolHover: "rgba(0, 0, 0, 0.05)",
      toolActiveBg: "rgba(0, 0, 0, 0.08)",
    },
  },
  /**
   * Одна визуальная спецификация: React Flow `Background` (процессы) и CSS `radial-gradient` (дашборд в edit).
   */
  canvasDotGrid: {
    dotColor: "rgba(192, 198, 210, 0.38)",
    stepPx: 24,
    cssRadiusPx: 1,
    reactFlowPatternSize: 1.85,
  },
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    pill: 100,
  },
  shadow: {
    level1: "0px 1px 3px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
    /** Плавающие панели (палитра, инспектор) */
    float: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
    /** Карточки узлов на холсте */
    node: "0 2px 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)",
    nodeSelected: "0 4px 20px rgba(0, 95, 173, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)",
    panel: "0 8px 32px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
    lift: "0 3px 14px rgba(0,0,0,0.07)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    page: 16,
    section: 12,
    card: 12,
  },
} as const;

export type TaskMode = "list" | "gantt" | "kanban";
