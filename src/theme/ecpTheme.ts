import { createTheme } from "@mui/material";
import { figmaTokens } from "./figmaTokens";

export const ecpTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: figmaTokens.colors.primary,
      contrastText: figmaTokens.colors.onPrimary,
    },
    background: {
      default: figmaTokens.colors.pageBg,
      paper: figmaTokens.colors.surfaceLow,
    },
    text: {
      primary: figmaTokens.colors.textPrimary,
      secondary: figmaTokens.colors.textSecondary,
    },
    divider: figmaTokens.colors.outline,
    error: {
      main: figmaTokens.colors.danger,
    },
  },
  shape: {
    borderRadius: figmaTokens.radius.sm,
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    h5: {
      fontFamily: '"Roboto", "Segoe UI", sans-serif',
      fontWeight: 600,
      fontSize: 22,
      lineHeight: "28px",
    },
    h6: {
      fontFamily: '"Roboto", "Segoe UI", sans-serif',
      fontWeight: 500,
      fontSize: 18,
      lineHeight: "24px",
    },
    subtitle2: {
      fontFamily: '"Roboto", "Segoe UI", sans-serif',
      fontWeight: 500,
      fontSize: 17,
      lineHeight: "24px",
    },
    body1: {
      fontSize: 15,
      lineHeight: "22px",
      letterSpacing: 0.25,
    },
    body2: {
      fontSize: 13,
      lineHeight: "18px",
      color: figmaTokens.colors.textMuted,
    },
    caption: {
      fontSize: 13,
      lineHeight: "18px",
      color: figmaTokens.colors.textMuted,
    },
    button: {
      textTransform: "none",
      fontSize: 15,
      fontWeight: 600,
      lineHeight: "22px",
      letterSpacing: 0.1,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: figmaTokens.shadow.level1,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: figmaTokens.shadow.level1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: figmaTokens.radius.pill,
        },
      },
    },
  },
});

