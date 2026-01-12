-- Ensure public visitors can submit leads reliably
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);
