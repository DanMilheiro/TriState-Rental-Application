/*
  # Create vehicles table

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key) - Unique identifier for each vehicle
      - `make` (text, required) - Vehicle manufacturer (e.g., Toyota, Honda)
      - `model` (text, required) - Vehicle model name
      - `year` (text, required) - Year of manufacture
      - `plate` (text, required, unique) - License plate number
      - `vin` (text) - Vehicle Identification Number
      - `status` (text, required) - Current status: In-House, Loaned, or Maintenance
      - `type` (text, required) - Vehicle type (e.g., Sedan, SUV, Truck)
      - `color` (text) - Vehicle color
      - `mileage` (integer) - Current odometer reading
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `vehicles` table
    - Add policy for authenticated users to read all vehicles
    - Add policy for authenticated users to insert vehicles
    - Add policy for authenticated users to update vehicles
    - Add policy for authenticated users to delete vehicles
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year text NOT NULL,
  plate text NOT NULL UNIQUE,
  vin text,
  status text NOT NULL DEFAULT 'In-House',
  type text NOT NULL,
  color text,
  mileage integer,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Insert some sample data
INSERT INTO vehicles (make, model, year, plate, vin, status, type, color, mileage)
VALUES
  ('Toyota', 'Camry', '2024', 'ABC-1234', 'JT2BK18E0X0123456', 'In-House', 'Sedan', 'Silver', 15000),
  ('Honda', 'CR-V', '2023', 'XYZ-5678', '2HGFC2F59MH123456', 'Loaned', 'SUV', 'Black', 22000),
  ('Ford', 'F-150', '2024', 'DEF-9012', '1FTFW1E82MFC12345', 'In-House', 'Truck', 'Blue', 8500),
  ('Tesla', 'Model 3', '2023', 'GHI-3456', '5YJ3E1EA5KF123456', 'Loaned', 'Sedan', 'White', 18000),
  ('Chevrolet', 'Malibu', '2024', 'JKL-7890', '1G1ZD5ST5MF123456', 'In-House', 'Sedan', 'Red', 12000)
ON CONFLICT (plate) DO NOTHING;