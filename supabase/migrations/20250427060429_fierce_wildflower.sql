/*
  # Add initial data for Event Management System

  1. Initial Data
    - System user for non-authenticated operations
    - Sample events
    - Sample vendors
    - Sample budget categories
    - Sample expenses
    - Sample attendees and guests

  2. Notes
    - Added IF NOT EXISTS checks to prevent duplicate inserts
    - Uses DO blocks for conditional inserts
*/

-- Insert system user for non-authenticated operations if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = '00000000-0000-0000-0000-000000000000') THEN
    INSERT INTO public.users (id, email, name, role)
    VALUES ('00000000-0000-0000-0000-000000000000', 'system@example.com', 'System User', 'admin');
  END IF;
END $$;

-- Insert sample vendors if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.vendors WHERE id = '11111111-1111-1111-1111-111111111111') THEN
    INSERT INTO public.vendors (id, name, email, phone, category, address, website, notes)
    VALUES ('11111111-1111-1111-1111-111111111111', 'Grand Convention Center', 'bookings@grandconvention.com', '123-456-7890', 'venue', '123 Main St, Downtown', 'www.grandconvention.com', 'Preferred venue for large events');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.vendors WHERE id = '22222222-2222-2222-2222-222222222222') THEN
    INSERT INTO public.vendors (id, name, email, phone, category, address, website, notes)
    VALUES ('22222222-2222-2222-2222-222222222222', 'Gourmet Catering Co.', 'info@gourmetcatering.com', '234-567-8901', 'catering', '456 Food Ave', 'www.gourmetcatering.com', 'Excellent for corporate events');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.vendors WHERE id = '33333333-3333-3333-3333-333333333333') THEN
    INSERT INTO public.vendors (id, name, email, phone, category, address, website, notes)
    VALUES ('33333333-3333-3333-3333-333333333333', 'MediaBoost Marketing', 'campaigns@mediaboost.com', '345-678-9012', 'marketing', '789 Digital Blvd', 'www.mediaboost.com', 'Specializes in event promotion');
  END IF;
END $$;

-- Insert sample events if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id = '44444444-4444-4444-4444-444444444444') THEN
    INSERT INTO public.events (id, title, description, start_date, end_date, location, status, created_by)
    VALUES ('44444444-4444-4444-4444-444444444444', 'Annual Tech Conference 2025', 'Join us for the biggest tech conference of the year', '2025-06-15 09:00:00+00', '2025-06-17 18:00:00+00', 'Grand Convention Center', 'published', '00000000-0000-0000-0000-000000000000');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id = '55555555-5555-5555-5555-555555555555') THEN
    INSERT INTO public.events (id, title, description, start_date, end_date, location, status, created_by)
    VALUES ('55555555-5555-5555-5555-555555555555', 'Product Launch Event', 'Exclusive product launch party', '2025-07-20 18:00:00+00', '2025-07-20 22:00:00+00', 'Innovation Hub', 'draft', '00000000-0000-0000-0000-000000000000');
  END IF;
END $$;

-- Insert budget categories for events if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.budget_categories WHERE event_id = '44444444-4444-4444-4444-444444444444' AND name = 'venue') THEN
    INSERT INTO public.budget_categories (event_id, name, allocated, spent)
    VALUES
      ('44444444-4444-4444-4444-444444444444', 'venue', 5000, 4500),
      ('44444444-4444-4444-4444-444444444444', 'catering', 3000, 2800),
      ('44444444-4444-4444-4444-444444444444', 'marketing', 2000, 1500),
      ('44444444-4444-4444-4444-444444444444', 'staff', 1500, 1200),
      ('44444444-4444-4444-4444-444444444444', 'other', 1000, 600);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.budget_categories WHERE event_id = '55555555-5555-5555-5555-555555555555' AND name = 'venue') THEN
    INSERT INTO public.budget_categories (event_id, name, allocated, spent)
    VALUES
      ('55555555-5555-5555-5555-555555555555', 'venue', 3000, 0),
      ('55555555-5555-5555-5555-555555555555', 'catering', 2000, 0),
      ('55555555-5555-5555-5555-555555555555', 'marketing', 1500, 500),
      ('55555555-5555-5555-5555-555555555555', 'staff', 1000, 0),
      ('55555555-5555-5555-5555-555555555555', 'other', 500, 0);
  END IF;
END $$;

-- Insert sample expenses if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.expenses WHERE event_id = '44444444-4444-4444-4444-444444444444' AND category = 'venue' AND amount = 4500) THEN
    INSERT INTO public.expenses (event_id, category, amount, description, date, vendor_id, status)
    VALUES
      ('44444444-4444-4444-4444-444444444444', 'venue', 4500, 'Venue rental fee', '2025-05-20 14:00:00+00', '11111111-1111-1111-1111-111111111111', 'approved'),
      ('44444444-4444-4444-4444-444444444444', 'catering', 2800, 'Catering services for 200 people', '2025-05-25 11:30:00+00', '22222222-2222-2222-2222-222222222222', 'approved'),
      ('44444444-4444-4444-4444-444444444444', 'marketing', 1500, 'Social media campaign', '2025-05-10 09:15:00+00', '33333333-3333-3333-3333-333333333333', 'approved'),
      ('55555555-5555-5555-5555-555555555555', 'marketing', 500, 'Initial marketing materials', '2025-06-01 10:00:00+00', '33333333-3333-3333-3333-333333333333', 'approved');
  END IF;
END $$;

-- Insert sample attendee registration if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.attendees WHERE user_id = '00000000-0000-0000-0000-000000000000' AND event_id = '44444444-4444-4444-4444-444444444444') THEN
    INSERT INTO public.attendees (user_id, event_id, registration_date, status)
    VALUES ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', '2025-05-01 10:00:00+00', 'registered');
  END IF;
END $$;

-- Insert sample guest if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.guests WHERE event_id = '44444444-4444-4444-4444-444444444444' AND email = 'john@example.com') THEN
    INSERT INTO public.guests (event_id, name, email, phone, invited_by, status, plus_one)
    VALUES ('44444444-4444-4444-4444-444444444444', 'John Guest', 'john@example.com', '567-890-1234', '00000000-0000-0000-0000-000000000000', 'confirmed', true);
  END IF;
END $$;