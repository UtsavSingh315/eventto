/*
  # Add initial data for Event Management System

  1. Initial Data
    - Admin user
    - Sample events
    - Sample vendors
    - Sample budget categories
    - Sample expenses
    - Sample attendees and guests

  2. Notes
    - All IDs use proper UUID format
    - Timestamps use consistent format
*/

-- Insert admin user
INSERT INTO auth.users (id, email)
VALUES ('d0d8aa1a-b1b0-4a7a-8c2f-f7c95f443ad6', 'admin@example.com');

INSERT INTO public.users (id, email, name, role)
VALUES ('d0d8aa1a-b1b0-4a7a-8c2f-f7c95f443ad6', 'admin@example.com', 'Admin User', 'admin');

-- Insert sample vendors
INSERT INTO public.vendors (id, name, email, phone, category, address, website, notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Grand Convention Center', 'bookings@grandconvention.com', '123-456-7890', 'venue', '123 Main St, Downtown', 'www.grandconvention.com', 'Preferred venue for large events'),
  ('22222222-2222-2222-2222-222222222222', 'Gourmet Catering Co.', 'info@gourmetcatering.com', '234-567-8901', 'catering', '456 Food Ave', 'www.gourmetcatering.com', 'Excellent for corporate events'),
  ('33333333-3333-3333-3333-333333333333', 'MediaBoost Marketing', 'campaigns@mediaboost.com', '345-678-9012', 'marketing', '789 Digital Blvd', 'www.mediaboost.com', 'Specializes in event promotion');

-- Insert sample events
INSERT INTO public.events (id, title, description, start_date, end_date, location, status, created_by)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Annual Tech Conference 2025', 'Join us for the biggest tech conference of the year', '2025-06-15 09:00:00+00', '2025-06-17 18:00:00+00', 'Grand Convention Center', 'published', 'd0d8aa1a-b1b0-4a7a-8c2f-f7c95f443ad6'),
  ('55555555-5555-5555-5555-555555555555', 'Product Launch Event', 'Exclusive product launch party', '2025-07-20 18:00:00+00', '2025-07-20 22:00:00+00', 'Innovation Hub', 'draft', 'd0d8aa1a-b1b0-4a7a-8c2f-f7c95f443ad6');

-- Insert budget categories for events
INSERT INTO public.budget_categories (event_id, name, allocated, spent)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'venue', 5000, 4500),
  ('44444444-4444-4444-4444-444444444444', 'catering', 3000, 2800),
  ('44444444-4444-4444-4444-444444444444', 'marketing', 2000, 1500),
  ('44444444-4444-4444-4444-444444444444', 'staff', 1500, 1200),
  ('44444444-4444-4444-4444-444444444444', 'other', 1000, 600),
  ('55555555-5555-5555-5555-555555555555', 'venue', 3000, 0),
  ('55555555-5555-5555-5555-555555555555', 'catering', 2000, 0),
  ('55555555-5555-5555-5555-555555555555', 'marketing', 1500, 500),
  ('55555555-5555-5555-5555-555555555555', 'staff', 1000, 0),
  ('55555555-5555-5555-5555-555555555555', 'other', 500, 0);

-- Insert sample expenses
INSERT INTO public.expenses (event_id, category, amount, description, date, vendor_id, status)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'venue', 4500, 'Venue rental fee', '2025-05-20 14:00:00+00', '11111111-1111-1111-1111-111111111111', 'approved'),
  ('44444444-4444-4444-4444-444444444444', 'catering', 2800, 'Catering services for 200 people', '2025-05-25 11:30:00+00', '22222222-2222-2222-2222-222222222222', 'approved'),
  ('44444444-4444-4444-4444-444444444444', 'marketing', 1500, 'Social media campaign', '2025-05-10 09:15:00+00', '33333333-3333-3333-3333-333333333333', 'approved'),
  ('55555555-5555-5555-5555-555555555555', 'marketing', 500, 'Initial marketing materials', '2025-06-01 10:00:00+00', '33333333-3333-3333-3333-333333333333', 'approved');

-- Insert sample attendee
INSERT INTO auth.users (id, email)
VALUES ('66666666-6666-6666-6666-666666666666', 'attendee@example.com');

INSERT INTO public.users (id, email, name, role)
VALUES ('66666666-6666-6666-6666-666666666666', 'attendee@example.com', 'Test Attendee', 'attendee');

-- Insert attendee registration
INSERT INTO public.attendees (user_id, event_id, registration_date, status)
VALUES ('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', '2025-05-01 10:00:00+00', 'registered');

-- Insert sample guest
INSERT INTO public.guests (event_id, name, email, phone, invited_by, status, plus_one)
VALUES ('44444444-4444-4444-4444-444444444444', 'John Guest', 'john@example.com', '567-890-1234', 'd0d8aa1a-b1b0-4a7a-8c2f-f7c95f443ad6', 'confirmed', true);