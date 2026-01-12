-- Drop the existing restrictive INSERT policy on leads
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

-- Create a new PERMISSIVE policy for public lead submissions
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);