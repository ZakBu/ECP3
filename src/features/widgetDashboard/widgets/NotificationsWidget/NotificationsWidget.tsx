import { Alert, Stack } from "@mui/material";

export default function NotificationsWidget() {
  return (
    <Stack spacing={1}>
      <Alert severity="warning">3 задачи подходят к сроку исполнения</Alert>
      <Alert severity="info">Назначено новое согласование документа</Alert>
    </Stack>
  );
}

