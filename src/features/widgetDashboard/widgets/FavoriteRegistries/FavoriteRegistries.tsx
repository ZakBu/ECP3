import { List, ListItemButton, ListItemText } from "@mui/material";

export default function FavoriteRegistries() {
  return (
    <List dense>
      <ListItemButton>
        <ListItemText primary="Реестр объектов капитального строительства" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Реестр разрешительной документации" />
      </ListItemButton>
    </List>
  );
}

