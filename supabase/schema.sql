-- ============================================================
-- Викторина ГЕРОФАРМ: схема БД, RLS и тестовые данные
-- Выполните этот скрипт в Supabase SQL Editor
-- ============================================================

-- Расширение для UUID (обычно уже включено в Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Таблица вопросов
-- correct_index хранится только на сервере (service role)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  options JSONB NOT NULL CHECK (jsonb_typeof(options) = 'array'),
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.questions IS 'Банк вопросов викторины';
COMMENT ON COLUMN public.questions.options IS 'Массив строк с вариантами ответа';
COMMENT ON COLUMN public.questions.correct_index IS 'Индекс правильного ответа (0-based), недоступен клиенту';

-- ------------------------------------------------------------
-- Таблица сессий
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 10)),
  answers JSONB,
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sessions IS 'Сессии прохождения викторины';
COMMENT ON COLUMN public.sessions.question_ids IS 'UUID выбранных вопросов в порядке показа';
COMMENT ON COLUMN public.sessions.answers IS 'Ответы пользователя: { "questionId": selectedIndex }';

CREATE INDEX IF NOT EXISTS idx_sessions_email ON public.sessions (email);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.sessions (started_at DESC);

-- ------------------------------------------------------------
-- Представление без correct_index (для документации; клиент не использует)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW public.questions_public AS
SELECT id, text, options
FROM public.questions;

-- ------------------------------------------------------------
-- RLS: вопросы полностью закрыты для anon/authenticated
-- Сервер читает через service role key
-- ------------------------------------------------------------
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Никаких политик для questions = полный запрет для anon/authenticated

-- ------------------------------------------------------------
-- RLS: сессии — только сервер (service role) пишет и читает
-- ------------------------------------------------------------
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Никаких публичных политик = доступ только через service role

-- ------------------------------------------------------------
-- Функция: атомарное создание сессии с серверным started_at
-- Вызывается только через service role из API
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_quiz_session(
  p_full_name TEXT,
  p_email TEXT,
  p_question_ids UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO public.sessions (full_name, email, question_ids, started_at)
  VALUES (
    p_full_name,
    lower(trim(p_email)),
    to_jsonb(p_question_ids),
    now()
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_quiz_session(TEXT, TEXT, UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_quiz_session(TEXT, TEXT, UUID[]) TO service_role;

-- ------------------------------------------------------------
-- Функция: завершение сессии с серверным finished_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.finish_quiz_session(
  p_session_id UUID,
  p_score INTEGER,
  p_answers JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_started_at TIMESTAMPTZ;
BEGIN
  SELECT started_at INTO v_started_at
  FROM public.sessions
  WHERE id = p_session_id AND finished_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  UPDATE public.sessions
  SET
    finished_at = now(),
    score = p_score,
    answers = p_answers
  WHERE id = p_session_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.finish_quiz_session(UUID, INTEGER, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_quiz_session(UUID, INTEGER, JSONB) TO service_role;

-- ------------------------------------------------------------
-- Тестовые вопросы (15 шт.) — замените на свои
-- ------------------------------------------------------------
INSERT INTO public.questions (text, options, correct_index) VALUES
(
  'Компания «ГЕРОФАРМ» была основана в 1996 году. Какой основной профиль деятельности компании?',
  '["Производство лекарственных препаратов", "Строительство", "IT-разработка", "Ритейл"]'::jsonb,
  0
),
(
  'Сколько лет компании «ГЕРОФАРМ» исполняется в 2026 году?',
  '["20 лет", "25 лет", "30 лет", "15 лет"]'::jsonb,
  1
),
(
  'Какой из перечисленных цветов является корпоративным цветом «ГЕРОФАРМ»?',
  '["#F7941D (оранжевый)", "#0000FF (синий)", "#FF00FF (пурпурный)", "#808080 (серый)"]'::jsonb,
  0
),
(
  'Второй корпоративный цвет «ГЕРОФАРМ» — это:',
  '["#23A790 (бирюзовый)", "#FF0000 (красный)", "#FFFF00 (жёлтый)", "#FFFFFF (белый)"]'::jsonb,
  0
),
(
  '«ГЕРОФАРМ» специализируется в том числе на разработке препаратов для лечения:',
  '["Сахарного диабета", "Только простуды", "Только аллергии", "Только кожных заболеваний"]'::jsonb,
  0
),
(
  'Где расположена штаб-квартира компании «ГЕРОФАРМ»?',
  '["Санкт-Петербург", "Москва", "Казань", "Новосибирск"]'::jsonb,
  0
),
(
  'Как называется международное направление компании «ГЕРОФАРМ»?',
  '["Geropharm International", "Global Pharma", "EuroMed", "PharmaWorld"]'::jsonb,
  0
),
(
  'Компания «ГЕРОФАРМ» активно инвестирует в:',
  '["Научные исследования и разработки", "Недвижимость", "Авиаперевозки", "Сельское хозяйство"]'::jsonb,
  0
),
(
  'Какой принцип лежит в основе деятельности «ГЕРОФАРМ»?',
  '["Доступные инновационные лекарства для пациентов", "Максимизация прибыли любой ценой", "Только экспорт", "Только OTC-препараты"]'::jsonb,
  0
),
(
  'Препараты «ГЕРОФАРМ» производятся в соответствии с:',
  '["Стандартами GMP", "Только местными нормами", "Без сертификации", "Стандартами ISO 9001 только для офисов"]'::jsonb,
  0
),
(
  'Какой из продуктовых направлений относится к портфелю «ГЕРОФАРМ»?',
  '["Эндокринология", "Автомобилестроение", "Текстильная промышленность", "Судостроение"]'::jsonb,
  0
),
(
  'Символ юбилея «ГЕРОФАРМ» в 2026 году — это:',
  '["Цифры 25", "Цифры 20", "Цифры 30", "Цифры 10"]'::jsonb,
  0
),
(
  'Компания «ГЕРОФАРМ» сотрудничает с:',
  '["Медицинским сообществом и научными центрами", "Только с ритейлерами", "Только с банками", "Только с СМИ"]'::jsonb,
  0
),
(
  'Какой подход «ГЕРОФАРМ» использует при разработке новых препаратов?',
  '["Научно обоснованный, основанный на клинических данных", "Случайный подбор формул", "Копирование без исследований", "Только маркетинговый"]'::jsonb,
  0
),
(
  'Миссия «ГЕРОФАРМ» связана с:',
  '["Улучшением качества жизни пациентов", "Строительством жилых комплексов", "Производством бытовой химии", "Разработкой ПО"]'::jsonb,
  0
);

-- Проверка
SELECT count(*) AS questions_count FROM public.questions;

-- ------------------------------------------------------------
-- Статистика викторины: счётчик завершивших и лучшее время
-- Вызывается клиентом через anon (SECURITY DEFINER)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_quiz_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_best_time FLOAT;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM public.sessions
  WHERE finished_at IS NOT NULL;

  SELECT EXTRACT(EPOCH FROM MIN(finished_at - started_at))
  INTO v_best_time
  FROM public.sessions
  WHERE finished_at IS NOT NULL
    AND score = 10;

  RETURN json_build_object(
    'count', v_count,
    'best_time', v_best_time
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_quiz_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_quiz_stats() TO authenticated;
