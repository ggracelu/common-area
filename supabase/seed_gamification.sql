-- Initial seed data for gamification system
-- This file contains sample prompts, achievements, and other gamification content

-- Get the active season ID (assuming Chicago Summer 2026)
DO $$
DECLARE
  season_id UUID;
BEGIN
  SELECT id INTO season_id FROM seasons WHERE slug = 'chicago-summer-2026' LIMIT 1;

  IF season_id IS NULL THEN
    RAISE NOTICE 'No active season found. Skipping prompt seeding.';
    RETURN;
  END IF;

  -- Insert sample bingo prompts
  INSERT INTO bingo_prompts (season_id, title, description, prompt_type, difficulty, requires_interaction, points, display_order, is_active)
  VALUES
    -- Icebreakers (Easy)
    (season_id, 'Ask someone about their favorite neighborhood spot', 'Find someone in your cohort and ask them what their favorite place in the neighborhood is.', 'icebreaker', 'easy', true, 1, 1, true),
    (season_id, 'Share a story about your neighborhood', 'Tell someone about a memorable experience you''ve had in this neighborhood.', 'icebreaker', 'medium', true, 2, 2, true),
    (season_id, 'Ask what brought someone to Common Area', 'Learn about someone''s motivation for joining the community.', 'icebreaker', 'easy', true, 1, 3, true),

    -- Shared Experiences (Easy)
    (season_id, 'Order the same drink as someone else', 'Notice what someone else is ordering and try it yourself. It''s a simple way to share an experience.', 'shared_experience', 'easy', false, 1, 4, true),
    (season_id, 'Share your favorite thing about this place', 'Tell someone what you love most about this particular venue or neighborhood.', 'shared_experience', 'easy', true, 1, 5, true),
    (season_id, 'Try a new activity at a local business', 'Visit one of our partner businesses and try something you''ve never done before.', 'shared_experience', 'medium', false, 2, 6, true),

    -- Discovery (Easy/Medium)
    (season_id, 'Find a hidden detail in this space', 'Look around and find something interesting that others might have missed. Share it with someone.', 'discovery', 'medium', false, 2, 7, true),
    (season_id, 'Learn a fact about a local business', 'Ask the staff at one of our partner businesses about their history or something interesting about the place.', 'discovery', 'easy', true, 1, 8, true),
    (season_id, 'Discover a new neighborhood spot', 'Find a place in the neighborhood you''ve never been to before.', 'discovery', 'medium', false, 2, 9, true),

    -- Collaboration (Medium/Hard)
    (season_id, 'Help someone complete their prompt', 'If you see someone working on a prompt, offer to help them out.', 'collaboration', 'medium', true, 2, 10, true),
    (season_id, 'Introduce two people to each other', 'If you know two people who haven''t met, introduce them and help start a conversation.', 'collaboration', 'hard', true, 3, 11, true),
    (season_id, 'Take a group photo with your cohort', 'Gather some cohort members and capture a moment together. It''s a great way to build memories.', 'collaboration', 'medium', true, 2, 12, true),

    -- Recognition (Easy)
    (season_id, 'Wave at someone you''ve seen before', 'Recognize a familiar face from your cohort and give them a friendly wave.', 'recognition', 'easy', false, 1, 13, true),
    (season_id, 'Compliment someone on their choice', 'Notice something someone has chosen (drink, activity, outfit) and give them a genuine compliment.', 'recognition', 'easy', true, 1, 14, true),
    (season_id, 'Acknowledge someone''s contribution', 'If someone helped you or contributed to a conversation, let them know you appreciate it.', 'recognition', 'easy', true, 1, 15, true)

  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Inserted sample bingo prompts for season %', season_id;
END $$;

-- Create sample achievements (these would be unlocked by users)
-- Note: Achievements are created dynamically when users unlock them
-- This is just documentation of available achievement types

/*
Achievement Types:
- first_prompt: Complete your first prompt
- streak_master: Maintain a 7-day prompt streak
- social_butterfly: Complete 10 interaction-based prompts
- explorer: Complete prompts at all 6 businesses
- connector: Introduce 5 people to each other
- regular: Visit the same business 3 times
*/

-- Create sample business quests for each activity
DO $$
DECLARE
  season_id UUID;
  activity_record RECORD;
BEGIN
  SELECT id INTO season_id FROM seasons WHERE slug = 'chicago-summer-2026' LIMIT 1;

  IF season_id IS NULL THEN
    RAISE NOTICE 'No active season found. Skipping business quest seeding.';
    RETURN;
  END IF;

  FOR activity_record IN
    SELECT id FROM activities
  LOOP
    -- Insert default quests for each activity
    INSERT INTO business_quests (activity_id, season_id, quest_type, title, description, target_count, points, is_sponsored)
    VALUES
      (activity_record.id, season_id, 'regular', 'The Regular', 'Visit this business 3 times this season', 3, 5, false),
      (activity_record.id, season_id, 'explorer', 'The Explorer', 'Try something new at this business', 1, 3, false),
      (activity_record.id, season_id, 'connector', 'The Connector', 'Introduce two people at this business', 1, 5, false),
      (activity_record.id, season_id, 'local', 'The Local', 'Learn a fact about this business from the staff', 1, 3, false)
    ON CONFLICT DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Inserted default business quests for season %', season_id;
END $$;

-- Create sample cohort challenges (these would be created when a cohort is formed)
-- Note: Challenges are created per cohort
-- This is just documentation of available challenge types

/*
Challenge Types:
- weekly_prompts: Complete at least 10 prompts as a cohort this week
- visit_all_businesses: Visit all 6 partner businesses as a cohort
- total_completions: Complete 50 total prompts as a cohort this season
- meet_everyone: Have every cohort member complete at least one prompt
*/

-- Create sample gamification preferences for testing (optional)
-- Uncomment to create test preferences
/*
INSERT INTO user_gamification_preferences (profile_id, notifications_enabled, max_active_prompts, prompt_types_enabled, quiet_hours_start, quiet_hours_end)
VALUES
  ('test-profile-1', true, 3, ARRAY['icebreaker', 'shared_experience', 'discovery', 'collaboration', 'recognition']::text[], '22:00', '08:00')
ON CONFLICT (profile_id) DO NOTHING;
*/
