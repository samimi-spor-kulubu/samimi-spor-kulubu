-- =============================================================
-- FAQ: hard-delete the "Reformer pilates eğitmeniniz kim?" entry.
-- The branch detail page already shows the trainer, and naming a
-- specific person in an FAQ row is brittle when staffing changes.
-- Hard delete (vs. active=false) so it doesn't clutter the admin
-- list either.
-- =============================================================

delete from public.faqs where key = 'pilates-trainer';
