import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { figmaTokens } from "../../../theme/figmaTokens";
import type { NodeKind } from "../types/process-builder.types";
import { STEP_PALETTE_SECTIONS, type StepPaletteItem } from "../components/StepPalette/stepPalette.config";

/** На канвасе — тёмный глиф на пастельной плитке (как в Agent Builder). */
const NODE_CARD_ICON_FOREGROUND = "#141414";

const paletteByKind = new Map<NodeKind, StepPaletteItem>();
for (const section of STEP_PALETTE_SECTIONS) {
  for (const item of section.items) {
    paletteByKind.set(item.kind, item);
  }
}

export interface NodeKindVisual {
  Icon: SvgIconComponent;
  iconBg: string;
  iconColor: string;
  typeLabel: string;
}

export function getNodeKindVisual(kind: NodeKind): NodeKindVisual {
  if (kind === "start") {
    return {
      Icon: PlayArrowOutlinedIcon,
      iconBg: "#E8F5F1",
      iconColor: NODE_CARD_ICON_FOREGROUND,
      typeLabel: "Старт",
    };
  }
  const item = paletteByKind.get(kind);
  if (item) {
    return { Icon: item.icon, iconBg: item.iconBg, iconColor: NODE_CARD_ICON_FOREGROUND, typeLabel: item.label };
  }
  return {
    Icon: PlayArrowOutlinedIcon,
    iconBg: figmaTokens.colors.surfaceVariant,
    iconColor: NODE_CARD_ICON_FOREGROUND,
    typeLabel: kind,
  };
}
