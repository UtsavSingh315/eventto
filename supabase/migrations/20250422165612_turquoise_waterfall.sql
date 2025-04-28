/*
  # Initial Schema Setup for Event Management System

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `location` (text)
      - `status` (text)
      - `cover_image_url` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
    
    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `category` (text)
      - `address` (text)
      - `website` (text)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `budget_categories`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `name` (text)
      - `allocated` (numeric)
      - `spent` (numeric)
      - `created_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `category` (text)
      - `amount` (numeric)
      - `description` (text)
      - `date` (timestamp)
      - `vendor_id` (uuid, references vendors)
      - `receipt_url` (text)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `attendees`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `event_id` (uuid, references events)
      - `registration_date` (timestamp)
      - `status` (text)
      - `ticket_type` (text)
      - `check_in_time` (timestamp)
      - `created_at` (timestamp)
    
    - `guests`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `invited_by` (uuid, references users)
      - `status` (text)
      - `plus_one` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'attendee')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'canceled', 'completed')),
  cover_image_url text,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vendors table first since it's referenced by expenses
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL CHECK (category IN ('venue', 'catering', 'marketing', 'entertainment', 'technology', 'other')),
  address text,
  website text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create budget_categories table
CREATE TABLE budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (name IN ('venue', 'catering', 'marketing', 'staff', 'other')),
  allocated numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('venue', 'catering', 'marketing', 'staff', 'other')),
  amount numeric NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL,
  receipt_url text,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create attendees table
CREATE TABLE attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  registration_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('registered', 'attended', 'canceled', 'no-show')),
  ticket_type text,
  check_in_time timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Create guests table
CREATE TABLE guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  invited_by uuid REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  status text NOT NULL CHECK (status IN ('invited', 'confirmed', 'declined', 'attended')),
  plus_one boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Create policies for events
CREATE POLICY "Admins can CRUD events" ON events
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Attendees can read events" ON events
  FOR SELECT TO authenticated
  USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM attendees
      WHERE attendees.event_id = id
      AND attendees.user_id = auth.uid()
    )
  );

-- Create policies for budget_categories
CREATE POLICY "Admins can CRUD budget categories" ON budget_categories
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create policies for expenses
CREATE POLICY "Admins can CRUD expenses" ON expenses
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create policies for vendors
CREATE POLICY "Admins can CRUD vendors" ON vendors
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Attendees can read vendors" ON vendors
  FOR SELECT TO authenticated
  USING (true);

-- Create policies for attendees
CREATE POLICY "Admins can CRUD attendees" ON attendees
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Attendees can read own registrations" ON attendees
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Create policies for guests
CREATE POLICY "Admins can CRUD guests" ON guests
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Users can read guests for their events" ON guests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM attendees
      WHERE attendees.event_id = event_id
      AND attendees.user_id = auth.uid()
    )
  );