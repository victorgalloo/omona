-- Add is_superadmin flag to profiles
ALTER TABLE profiles ADD COLUMN is_superadmin BOOLEAN DEFAULT false;

-- Set your account as superadmin (update with your actual user id after first login)
-- UPDATE profiles SET is_superadmin = true WHERE id = 'YOUR_USER_UUID';
