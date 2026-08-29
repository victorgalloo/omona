-- Add trial expiration to organizations
-- Default: 14 days from creation
ALTER TABLE organizations
  ADD COLUMN trial_ends_at TIMESTAMPTZ;

-- Set trial_ends_at for existing orgs (14 days from their creation)
UPDATE organizations
  SET trial_ends_at = created_at + INTERVAL '14 days'
  WHERE trial_ends_at IS NULL AND plan = 'free';

-- Default for new orgs
ALTER TABLE organizations
  ALTER COLUMN trial_ends_at SET DEFAULT NOW() + INTERVAL '14 days';
