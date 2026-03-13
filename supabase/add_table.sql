CREATE TABLE IF NOT EXISTS public.event_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own volunteer requests"
ON public.event_volunteers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own volunteer requests"
ON public.event_volunteers FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own volunteer requests"
ON public.event_volunteers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
