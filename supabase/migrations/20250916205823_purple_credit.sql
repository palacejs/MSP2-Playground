/*
  # MSP2 ARC Database Schema

  1. New Tables
    - `photos`
      - `id` (text, primary key)
      - `name` (text)
      - `data` (text, base64 image data)
      - `upload_date` (timestamptz)
    - `buttons`
      - `id` (text, primary key) 
      - `name` (text)
      - `link` (text)
      - `description` (text, JSON format)
      - `is_temporary` (boolean)
      - `expiry_date` (timestamptz, nullable)
      - `hidden` (boolean)
      - `created_date` (timestamptz)
    - `news`
      - `id` (text, primary key)
      - `title` (text, JSON format)
      - `content` (text, JSON format)  
      - `created_date` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id text PRIMARY KEY,
  name text NOT NULL,
  data text NOT NULL,
  upload_date timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are publicly readable"
  ON photos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- Buttons table
CREATE TABLE IF NOT EXISTS buttons (
  id text PRIMARY KEY,
  name text NOT NULL,
  link text NOT NULL,
  description text,
  is_temporary boolean DEFAULT false,
  expiry_date timestamptz,
  hidden boolean DEFAULT false,
  created_date timestamptz DEFAULT now()
);

ALTER TABLE buttons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buttons are publicly readable"
  ON buttons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert buttons"
  ON buttons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update buttons"
  ON buttons FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete buttons"
  ON buttons FOR DELETE
  TO authenticated
  USING (true);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  created_date timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News are publicly readable"
  ON news FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete news"
  ON news FOR DELETE
  TO authenticated
  USING (true);
