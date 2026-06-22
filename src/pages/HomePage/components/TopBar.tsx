import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { figmaTokens } from "../../../theme/figmaTokens";

interface TopBarProps {
  isEditing: boolean;
  onEnterEdit: () => void;
  timeContext?: "morning" | "day" | "evening";
}

export default function TopBar({ isEditing, onEnterEdit }: TopBarProps) {
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const profileOpen = Boolean(profileAnchor);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        minHeight: 60,
        px: { xs: 1.25, md: 1.5 },
        py: 0.5,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ ml: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            width: { xs: 310, md: 360 },
            height: 44,
            px: 1.8,
            borderRadius: "999px",
            border: `1px solid ${figmaTokens.colors.outline}`,
            bgcolor: figmaTokens.colors.surfaceLow,
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SearchOutlinedIcon sx={{ color: figmaTokens.colors.textMuted, fontSize: 19 }} />
          <InputBase fullWidth placeholder="Поиск" sx={{ fontSize: 16, color: figmaTokens.colors.textSecondary }} />
        </Paper>
        <IconButton size="medium">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 21, color: figmaTokens.colors.textSecondary }} />
        </IconButton>
        <IconButton size="medium">
          <AppsOutlinedIcon sx={{ fontSize: 21, color: figmaTokens.colors.textSecondary }} />
        </IconButton>
        <IconButton
          size="medium"
          onClick={(event) => setProfileAnchor(event.currentTarget)}
          aria-label="Открыть профиль"
          sx={{ p: 0.25 }}
        >
          <Avatar sx={{ width: 40, height: 40, bgcolor: figmaTokens.colors.primary }}>EA</Avatar>
        </IconButton>
      </Stack>
      <Popover
        open={profileOpen}
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 360,
              borderRadius: 3,
              p: 1.5,
              boxShadow: "0px 12px 32px rgba(21, 30, 55, 0.22)",
              bgcolor: "#FFFFFF",
            },
          },
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ width: 56, height: 56, bgcolor: figmaTokens.colors.primary }}>EA</Avatar>
            <Box>
              <Typography sx={{ fontSize: 15, color: figmaTokens.colors.textMuted }}>Администратор</Typography>
              <Typography sx={{ fontSize: 18, lineHeight: "24px", fontWeight: 600, color: figmaTokens.colors.textPrimary }}>
                Евгений Александров
              </Typography>
              <Typography sx={{ fontSize: 15, color: figmaTokens.colors.textSecondary }}>evgen11@it.mos.ru</Typography>
            </Box>
          </Stack>
          <Typography sx={{ fontSize: 15, color: figmaTokens.colors.textMuted, pl: 0.5 }}>Настройки</Typography>
          {!isEditing && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              onClick={() => {
                setProfileAnchor(null);
                onEnterEdit();
              }}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 1.2,
                cursor: "pointer",
                "&:hover": { bgcolor: "#F4F6FB" },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 22, color: figmaTokens.colors.textSecondary }} />
              <Typography sx={{ fontSize: 16, lineHeight: "22px", color: figmaTokens.colors.textSecondary }}>
                Редактировать главную страницу
              </Typography>
            </Stack>
          )}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 0.4 }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <DarkModeOutlinedIcon sx={{ fontSize: 22, color: figmaTokens.colors.textSecondary }} />
              <Typography sx={{ fontSize: 16, lineHeight: "22px", color: figmaTokens.colors.textSecondary }}>
                Темная тема
              </Typography>
            </Stack>
            <Switch checked={darkModeEnabled} onChange={(event) => setDarkModeEnabled(event.target.checked)} size="medium" />
          </Stack>
          <Divider sx={{ borderColor: "#ECEEF2" }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: 1.2,
              bgcolor: "#FDECEC",
              color: "#EB4335",
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: 16, lineHeight: "22px", fontWeight: 500 }}>Выйти</Typography>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  );
}

