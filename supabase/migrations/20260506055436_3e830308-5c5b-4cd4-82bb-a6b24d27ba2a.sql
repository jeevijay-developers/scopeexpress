REVOKE SELECT (correct_answer) ON public.quiz_questions FROM anon, authenticated;

DROP POLICY IF EXISTS "Anyone can update their quiz sessions" ON public.quiz_sessions;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_name_length CHECK (char_length(name) BETWEEN 1 AND 100) NOT VALID,
  ADD CONSTRAINT leads_mobile_format CHECK (char_length(mobile) BETWEEN 7 AND 20) NOT VALID,
  ADD CONSTRAINT leads_message_length CHECK (message IS NULL OR char_length(message) <= 2000) NOT VALID,
  ADD CONSTRAINT leads_city_length CHECK (city IS NULL OR char_length(city) <= 100) NOT VALID,
  ADD CONSTRAINT leads_class_length CHECK (class IS NULL OR char_length(class) <= 50) NOT VALID,
  ADD CONSTRAINT leads_school_length CHECK (school IS NULL OR char_length(school) <= 200) NOT VALID,
  ADD CONSTRAINT leads_career_interest_length CHECK (career_interest IS NULL OR char_length(career_interest) <= 200) NOT VALID,
  ADD CONSTRAINT leads_product_interest_length CHECK (product_interest IS NULL OR char_length(product_interest) <= 200) NOT VALID,
  ADD CONSTRAINT leads_source_page_length CHECK (char_length(source_page) <= 100) NOT VALID,
  ADD CONSTRAINT leads_interest_type_length CHECK (interest_type IS NULL OR char_length(interest_type) <= 100) NOT VALID,
  ADD CONSTRAINT leads_preferred_timing_length CHECK (preferred_timing IS NULL OR char_length(preferred_timing) <= 100) NOT VALID;