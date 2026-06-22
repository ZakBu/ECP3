import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { figmaTokens } from "../../../../../theme/figmaTokens";
import type { WidgetSize } from "../../../types/widget.types";

const rows = [
  ["Новая", "124", "Проверить данные заявления ИСП", "05.03.2024", "12.05.2025", "Артем Рычков"],
  ["Новая", "125", "Ознакомиться с заявлением ИСП", "05.03.2024", "12.05.2025", "Артем Рычков"],
  ["В работе", "128", "Проверить данные заявления ИСП", "05.03.2024", "28.04.2025", "Артем Рычков"],
  ["В работе", "129", "Ознакомиться с заявлением ИСП", "05.03.2024", "12.03.2025", "Артем Рычков"],
  ["Просрочено", "131", "Формирование и подписание решения об отказе", "05.03.2024", "12.03.2025", "Артем Рычков"],
];

interface ListViewProps {
  size?: WidgetSize;
}

export default function ListView({ size = "M" }: ListViewProps) {
  const visibleRows = size === "S" ? rows.slice(0, 1) : size === "M" ? rows.slice(0, 3) : rows;
  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Статус</TableCell>
            <TableCell>Код</TableCell>
            <TableCell>Наименование задачи</TableCell>
            <TableCell>Начало</TableCell>
            <TableCell>Срок</TableCell>
            <TableCell>Исполнитель</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={`${row[1]}-${row[0]}`}>
              <TableCell>
                <Chip
                  size="small"
                  label={row[0]}
                  color={row[0] === "Просрочено" ? "error" : row[0] === "В работе" ? "warning" : "info"}
                />
              </TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell>
                <Typography variant="body2">{row[2]}</Typography>
              </TableCell>
              <TableCell>{row[3]}</TableCell>
              <TableCell sx={{ color: row[0] === "Просрочено" ? figmaTokens.colors.danger : "inherit" }}>
                {row[4]}
              </TableCell>
              <TableCell>{row[5]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

