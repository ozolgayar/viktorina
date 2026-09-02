-- Площадка участника при регистрации
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS location TEXT;

COMMENT ON COLUMN public.sessions.location IS 'Площадка, выбранная при регистрации';

CREATE OR REPLACE FUNCTION public.create_quiz_session(
  p_full_name TEXT,
  p_email TEXT,
  p_question_ids UUID[],
  p_location TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO public.sessions (full_name, email, question_ids, location, started_at)
  VALUES (
    p_full_name,
    lower(trim(p_email)),
    to_jsonb(p_question_ids),
    nullif(trim(p_location), ''),
    now()
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_quiz_session(TEXT, TEXT, UUID[], TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_quiz_session(TEXT, TEXT, UUID[], TEXT) TO service_role;
