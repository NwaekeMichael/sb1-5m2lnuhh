/*
  # Create User Metrics Table

  1. New Tables
    - `user_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `stress_level` (integer)
      - `focus_score` (integer)
      - `activity_score` (integer)
      - `heart_rate` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_metrics` table
    - Add policies for authenticated users to read/update their own metrics
*/

CREATE TABLE IF NOT EXISTS user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stress_level integer DEFAULT 0,
  focus_score integer DEFAULT 0,
  activity_score integer DEFAULT 0,
  heart_rate integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own metrics"
  ON user_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON user_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to initialize user metrics on signup
CREATE OR REPLACE FUNCTION public.handle_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_metrics (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_signup();