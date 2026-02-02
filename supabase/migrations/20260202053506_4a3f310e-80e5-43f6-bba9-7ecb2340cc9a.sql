-- Create libraries table for location management
CREATE TABLE public.libraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  pin_code TEXT,
  phone TEXT,
  facilities JSONB DEFAULT '[]'::jsonb,
  timings TEXT DEFAULT '6:00 AM - 10:00 PM',
  seats INTEGER DEFAULT 50,
  price_per_month INTEGER DEFAULT 600,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on libraries table
ALTER TABLE public.libraries ENABLE ROW LEVEL SECURITY;

-- Anyone can read active libraries
CREATE POLICY "Anyone can read active libraries"
ON public.libraries
FOR SELECT
USING (is_active = true);

-- Only admins can manage libraries (all operations)
CREATE POLICY "Admins can manage libraries"
ON public.libraries
FOR ALL
USING (EXISTS (
  SELECT 1 FROM admin_users
  WHERE admin_users.user_id = auth.uid()
));

-- Add library_id and city columns to leads table
ALTER TABLE public.leads 
ADD COLUMN library_id UUID REFERENCES public.libraries(id),
ADD COLUMN city TEXT;