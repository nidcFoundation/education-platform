-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id VARCHAR PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operational Defaults Table (single row)
CREATE TABLE IF NOT EXISTS admin_operational_defaults (
  id INT PRIMARY KEY DEFAULT 1,
  reporting_window VARCHAR,
  review_sla VARCHAR,
  escalation_window VARCHAR,
  support_email VARCHAR,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Assets Table
CREATE TABLE IF NOT EXISTS content_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'draft',
  author VARCHAR,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT
);

-- Impact Reports Table
CREATE TABLE IF NOT EXISTS impact_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  quarter VARCHAR,
  year VARCHAR,
  status VARCHAR DEFAULT 'draft',
  metrics JSONB,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS is enabled and appropriate policies are set
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_operational_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_reports ENABLE ROW LEVEL SECURITY;

-- Service role access
CREATE POLICY "Service role full access on admin_settings" ON admin_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on admin_operational_defaults" ON admin_operational_defaults FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on content_assets" ON content_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on impact_reports" ON impact_reports FOR ALL USING (true) WITH CHECK (true);
