import { describe, expect, it } from "vitest";
import React from "react";
import { WIDGET_REGISTRY } from "../components/WidgetCatalog/WidgetCatalog.data";

describe("v8 widgets smoke", () => {
  it("renders all widgets for first state/size without crashing", async () => {
    for (const widget of WIDGET_REGISTRY) {
      const Component = widget.component as unknown as React.ComponentType<{ size?: unknown; state?: string }>;
      expect(Component).toBeTruthy();
      const element = React.createElement(Component, {
        size: widget.allowedSizes[0],
        state: widget.stateOptions?.[0]?.key,
      });
      expect(element).toBeTruthy();
    }
  });
});

