
-- Create mock_tests table
CREATE TABLE public.mock_tests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_name text NOT NULL,
  test_name text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  total_questions integer NOT NULL DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active mock tests"
ON public.mock_tests FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage mock tests"
ON public.mock_tests FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Create mock_test_questions table
CREATE TABLE public.mock_test_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mock_test_id uuid NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  question_number integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read mock test questions"
ON public.mock_test_questions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage mock test questions"
ON public.mock_test_questions FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Create mock_test_sessions table
CREATE TABLE public.mock_test_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mock_test_id uuid NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id),
  name text NOT NULL,
  mobile text NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb,
  score integer DEFAULT 0,
  total_attempted integer DEFAULT 0,
  completed boolean DEFAULT false,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_test_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create mock test sessions"
ON public.mock_test_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update mock test sessions"
ON public.mock_test_sessions FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all mock test sessions"
ON public.mock_test_sessions FOR SELECT
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
