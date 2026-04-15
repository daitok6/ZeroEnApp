-- Add JSONB column to store AI-generated scoring rationale and recommendation
ALTER TABLE public.applications
  ADD COLUMN score_rationale jsonb;

-- Expected shape:
-- {
--   "viability": "...",
--   "commitment": "...",
--   "feasibility": "...",
--   "market": "...",
--   "recommendation": "ACCEPT" | "BORDERLINE" | "REJECT",
--   "summary": "..."
-- }
