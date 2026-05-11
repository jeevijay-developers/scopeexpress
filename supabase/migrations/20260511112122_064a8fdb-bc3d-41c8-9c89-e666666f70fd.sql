
CREATE TABLE public.consultancy_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('job','admission','other')),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultancy_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit consultancy"
  ON public.consultancy_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view consultancy"
  ON public.consultancy_submissions
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
