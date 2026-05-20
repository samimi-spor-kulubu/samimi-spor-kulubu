-- =============================================================
-- Settings: defensive fix for any "sportsclup" typos that may
-- have made it into the live DB via admin edits. Replaces
-- "sportsclup" with "sportsclub" inside any settings.value
-- regardless of surrounding characters (handles edge cases like
-- "@samimi_sportsclupB" where extra chars were appended).
-- =============================================================

update public.settings
set
  value = replace(value, 'sportsclup', 'sportsclub'),
  updated_at = now()
where value ilike '%sportsclup%';
