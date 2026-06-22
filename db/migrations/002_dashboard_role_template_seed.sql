CREATE TABLE IF NOT EXISTS dashboard_role_template (
  role VARCHAR(50) PRIMARY KEY,
  layout_json JSONB NOT NULL,
  schema_version SMALLINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO dashboard_role_template (role, layout_json, schema_version)
VALUES
  ('specialist', '[{"widgetId":"kpi-counters","i":"kpi-0","x":0,"y":0,"w":4,"h":1}]', 1),
  ('head', '[{"widgetId":"kpi-counters","i":"kpi-0","x":0,"y":0,"w":4,"h":1}]', 1),
  ('admin', '[{"widgetId":"kpi-counters","i":"kpi-0","x":0,"y":0,"w":4,"h":1}]', 1),
  ('reader', '[{"widgetId":"favorite-registries","i":"reg-0","x":0,"y":0,"w":4,"h":1}]', 1)
ON CONFLICT (role) DO UPDATE
SET
  layout_json = EXCLUDED.layout_json,
  schema_version = EXCLUDED.schema_version,
  updated_at = now();

