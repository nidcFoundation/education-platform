-- Grant explicit permissions to the authenticated role for the profiles table
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
