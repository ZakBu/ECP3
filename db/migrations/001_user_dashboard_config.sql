CREATE TABLE IF NOT EXISTS user_dashboard_config (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  layout_json JSONB NOT NULL,
  widget_settings JSONB NOT NULL DEFAULT '{}',
  schema_version SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_udc_user_id ON user_dashboard_config (user_id);

