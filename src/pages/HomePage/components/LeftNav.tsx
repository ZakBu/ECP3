import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { Link, useLocation } from "react-router-dom";
import homeIcon from "../../../assets/home.svg";
import inboxIcon from "../../../assets/inbox.svg";
import logo from "../../../assets/logo.svg";
import pieChartIcon from "../../../assets/pie_chart.svg";
import { figmaTokens } from "../../../theme/figmaTokens";

/** Типографика навигации (Figma: Roboto SemiBold 14 / 20 / 0.1px) */
const navMenuTextSx = {
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "20px",
  letterSpacing: "0.1px",
} as const;

interface LeftNavProps {
  collapsed?: boolean;
}

export default function LeftNav({ collapsed = false }: LeftNavProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isProcessBuilder = location.pathname.startsWith("/process-builder");

  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        width: { md: collapsed ? 72 : 380 },
        bgcolor: figmaTokens.colors.surface,
        px: collapsed ? 1 : 3.5,
        pb: 3.5,
        pt: 0,
      }}
    >
      <Stack spacing={collapsed ? 0.5 : 1.25}>
        <Stack direction="row" alignItems="center" spacing={collapsed ? 0 : 1.5} sx={{ minHeight: 60 }} mb={0}>
          <IconButton size="medium" sx={{ mx: collapsed ? "auto" : 0 }}>
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>
          {!collapsed && (
            <>
              <Box component="img" src={logo} alt="ЕЦП ГД" sx={{ width: 30, height: 30 }} />
              <Typography sx={{ fontSize: 22, lineHeight: "28px", fontWeight: 700 }}>
                ЕЦП ГД
              </Typography>
            </>
          )}
        </Stack>
        <Stack spacing={collapsed ? 0.25 : 0.75}>
          <Stack
            component={Link}
            to="/"
            sx={{ textDecoration: "none" }}
            direction="row"
            alignItems="stretch"
            spacing={1.5}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={collapsed ? 0 : 1.5}
              sx={{
                px: collapsed ? 0 : 2.2,
                py: collapsed ? 1 : 1.45,
                borderRadius: "999px",
                bgcolor: isHome ? "#C6D5EE" : "transparent",
                width: "100%",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <Box component="img" src={homeIcon} alt="" sx={{ width: 24, height: 24 }} />
              {!collapsed && (
                <Typography sx={{ ...navMenuTextSx, color: isHome ? figmaTokens.colors.primary : "#404653" }}>Главная</Typography>
              )}
            </Stack>
          </Stack>

          <Stack
            component={Link}
            to="/process-builder"
            sx={{ textDecoration: "none" }}
            direction="row"
            alignItems="stretch"
            spacing={1.5}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={collapsed ? 0 : 1.5}
              sx={{
                px: collapsed ? 0 : 2.2,
                py: collapsed ? 1 : 1.45,
                borderRadius: "999px",
                bgcolor: isProcessBuilder ? "#C6D5EE" : "transparent",
                width: "100%",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <AccountTreeOutlinedIcon sx={{ fontSize: 24, color: isProcessBuilder ? figmaTokens.colors.primary : "#404653" }} />
              {!collapsed && (
                <Typography sx={{ ...navMenuTextSx, color: isProcessBuilder ? figmaTokens.colors.primary : "#404653" }}>
                  Конструктор бизнес-процессов
                </Typography>
              )}
            </Stack>
          </Stack>

          {collapsed ? (
            <Stack alignItems="center" spacing={0.5} sx={{ pt: 0.5 }}>
              <IconButton size="medium" aria-label="Госуслуги и функции">
                <Box component="img" src={inboxIcon} alt="" sx={{ width: 24, height: 24 }} />
              </IconButton>
              <IconButton size="medium" aria-label="Информация и аналитика">
                <Box component="img" src={pieChartIcon} alt="" sx={{ width: 24, height: 24 }} />
              </IconButton>
            </Stack>
          ) : (
            <>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 1.8, py: 1.15 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box component="img" src={inboxIcon} alt="" sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ ...navMenuTextSx, color: "#404653" }}>Госуслуги и функции</Typography>
                </Stack>
                <ExpandLessIcon sx={{ fontSize: 18, color: "#404653" }} />
              </Stack>
              <Typography sx={{ pl: 7.2, py: 0.95, ...navMenuTextSx, color: "#404653" }}>Задачи</Typography>
              <Typography sx={{ pl: 7.2, py: 0.95, ...navMenuTextSx, color: "#404653" }}>Возможности</Typography>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 1.8, py: 1.15 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box component="img" src={pieChartIcon} alt="" sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ ...navMenuTextSx, color: "#404653" }}>Информация и аналитика</Typography>
                </Stack>
                <ExpandLessIcon sx={{ fontSize: 18, color: "#404653" }} />
              </Stack>
              <Typography sx={{ pl: 7.2, py: 0.95, ...navMenuTextSx, color: "#404653" }}>Реестры</Typography>
              <Typography sx={{ pl: 7.2, py: 0.95, ...navMenuTextSx, color: "#404653" }}>Дашборды</Typography>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

