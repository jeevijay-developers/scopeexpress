
-- Restrict access to correct_answer column on quiz_questions and mock_test_questions
-- so anonymous/authenticated clients cannot read answers. Service role (edge functions
-- and admin operations) retains full access.

-- quiz_questions
REVOKE SELECT ON public.quiz_questions FROM anon, authenticated;
GRANT SELECT (id, question, options, topic, class_level, language, created_at) ON public.quiz_questions TO anon, authenticated;
GRANT ALL ON public.quiz_questions TO service_role;

-- mock_test_questions
REVOKE SELECT ON public.mock_test_questions FROM anon, authenticated;
GRANT SELECT (id, question, options, question_number, mock_test_id, created_at) ON public.mock_test_questions TO anon, authenticated;
GRANT ALL ON public.mock_test_questions TO service_role;
