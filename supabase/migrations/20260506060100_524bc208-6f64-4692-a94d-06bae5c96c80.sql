REVOKE SELECT (correct_answer) ON public.mock_test_questions FROM anon;
GRANT SELECT (correct_answer) ON public.mock_test_questions TO authenticated;

DROP POLICY IF EXISTS "Anyone can update mock test sessions" ON public.mock_test_sessions;