
CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active exams"
  ON public.exams FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage exams"
  ON public.exams FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

INSERT INTO public.exams (name) VALUES
  ('SSC CGL'), ('SSC CHSL'), ('SSC MTS'), ('SSC GD Constable'),
  ('Army GD'), ('Army Clerk'), ('Navy AA/SSR'), ('Air Force X/Y Group'),
  ('MPPSC'), ('UPPSC'), ('Railway Group D'), ('Railway NTPC'),
  ('Patwari'), ('Police Constable'), ('Bank PO/Clerk'), ('CTET/TET')
ON CONFLICT (name) DO NOTHING;
