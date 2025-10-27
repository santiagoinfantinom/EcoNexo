-- Add created_by field to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create event_administrators table
CREATE TABLE IF NOT EXISTS public.event_administrators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_administrators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_administrators
-- Users can view all administrators
CREATE POLICY "Administrators are viewable by anyone" 
ON public.event_administrators
FOR SELECT 
USING (true);

-- Only existing administrators can add new administrators
CREATE POLICY "Administrators can add other administrators" 
ON public.event_administrators
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.event_administrators 
    WHERE event_id = NEW.event_id 
    AND user_id = auth.uid()
  )
);

-- Only the creator or existing administrators can remove administrators
CREATE POLICY "Administrators can remove other administrators" 
ON public.event_administrators
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id 
    AND created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.event_administrators 
    WHERE event_id = event_administrators.event_id 
    AND user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS event_administrators_event_id_idx 
ON public.event_administrators (event_id);

CREATE INDEX IF NOT EXISTS event_administrators_user_id_idx 
ON public.event_administrators (user_id);

-- Create index for events.created_by
CREATE INDEX IF NOT EXISTS events_created_by_idx 
ON public.events (created_by);

