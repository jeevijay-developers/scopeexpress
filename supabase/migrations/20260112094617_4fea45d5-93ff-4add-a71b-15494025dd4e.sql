-- Create leads table for all form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  class TEXT,
  school TEXT,
  source_page TEXT NOT NULL,
  interest_type TEXT,
  preferred_timing TEXT,
  message TEXT,
  career_interest TEXT,
  product_interest TEXT,
  quiz_topic TEXT,
  quiz_score INTEGER,
  quiz_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_questions table for AI-generated questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  class_level TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_sessions table to track practice activity
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id),
  topic TEXT NOT NULL,
  questions_attempted INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Beginner',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Leads: Anyone can insert (public form submissions), only admins can view
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Quiz questions: Anyone can read (public quiz), only admins can manage
CREATE POLICY "Anyone can read quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage quiz questions" 
ON public.quiz_questions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Quiz sessions: Anyone can insert/update their own, admins can view all
CREATE POLICY "Anyone can create quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their quiz sessions" 
ON public.quiz_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Only admins can view all quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Admin users: Only admins can view admin list
CREATE POLICY "Only admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_leads_source_page ON public.leads(source_page);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_quiz_questions_topic_class ON public.quiz_questions(topic, class_level);
CREATE INDEX idx_quiz_sessions_lead_id ON public.quiz_sessions(lead_id);