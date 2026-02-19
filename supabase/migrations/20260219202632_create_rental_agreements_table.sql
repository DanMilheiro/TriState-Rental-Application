/*
  # Create rental_agreements table

  1. New Tables
    - `rental_agreements`
      - `id` (uuid, primary key) - Unique identifier for each agreement
      - `agreement_number` (text, unique) - Human-readable agreement number (e.g., AGR-001)
      - `renter_name` (text) - Full name of the renter
      - `renter_address` (text) - Street address
      - `renter_city` (text) - City
      - `renter_state` (text) - State
      - `renter_zip_code` (text) - ZIP code
      - `renter_phone` (text) - Cell phone number
      - `renter_email` (text) - Email address
      - `drivers_license` (text) - Driver's license number
      - `license_state` (text) - State that issued the license
      - `license_expiration` (date) - License expiration date
      - `date_of_birth` (date) - Renter's date of birth
      - `insurance_company` (text) - Insurance company name
      - `policy_number` (text) - Insurance policy number
      - `policy_expiration` (date) - Policy expiration date
      - `insurance_agent` (text, nullable) - Insurance agent name
      - `agent_phone` (text, nullable) - Agent phone number
      - `adjuster` (text, nullable) - Adjuster name
      - `adjuster_phone` (text, nullable) - Adjuster phone number
      - `claim_number` (text, nullable) - Claim number
      - `date_of_loss` (date, nullable) - Date of loss for insurance claim
      - `original_car_number` (text, nullable) - Customer's vehicle VIN
      - `original_license` (text, nullable) - Customer's vehicle license plate
      - `original_year` (text, nullable) - Customer's vehicle year
      - `original_make` (text, nullable) - Customer's vehicle make
      - `original_model` (text, nullable) - Customer's vehicle model
      - `original_color` (text, nullable) - Customer's vehicle color
      - `current_car_number` (text) - Rental vehicle VIN
      - `current_license` (text) - Rental vehicle license plate
      - `current_year` (text) - Rental vehicle year
      - `current_make` (text) - Rental vehicle make
      - `current_model` (text) - Rental vehicle model
      - `current_color` (text) - Rental vehicle color
      - `date_due_back` (date, nullable) - Date the rental is due back
      - `mileage_out` (text, nullable) - Mileage when vehicle left
      - `fuel_gauge_out` (text, nullable) - Fuel level when vehicle left
      - `deposits` (text, nullable) - Deposit amount
      - `sales_tax` (text, nullable) - Sales tax percentage
      - `state_sales_tax` (text, nullable) - State sales tax percentage
      - `fuel_charges` (text, nullable) - Fuel charge per gallon
      - `status` (text) - Agreement status (Active, Completed, Cancelled)
      - `created_at` (timestamptz) - When the agreement was created
      - `updated_at` (timestamptz) - When the agreement was last updated

  2. Security
    - Enable RLS on `rental_agreements` table
    - Add policies for public access (since there's no auth yet)
    - In production, these policies should be restricted to authenticated users

  3. Notes
    - Agreement numbers are generated sequentially starting from AGR-001
    - Status defaults to "Active"
    - All monetary and numeric fields stored as text for flexibility in display
*/

CREATE TABLE IF NOT EXISTS rental_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_number text UNIQUE NOT NULL,
  renter_name text NOT NULL,
  renter_address text NOT NULL,
  renter_city text NOT NULL,
  renter_state text NOT NULL,
  renter_zip_code text NOT NULL,
  renter_phone text NOT NULL,
  renter_email text NOT NULL,
  drivers_license text NOT NULL,
  license_state text NOT NULL,
  license_expiration date NOT NULL,
  date_of_birth date NOT NULL,
  insurance_company text NOT NULL,
  policy_number text NOT NULL,
  policy_expiration date NOT NULL,
  insurance_agent text,
  agent_phone text,
  adjuster text,
  adjuster_phone text,
  claim_number text,
  date_of_loss date,
  original_car_number text,
  original_license text,
  original_year text,
  original_make text,
  original_model text,
  original_color text,
  current_car_number text NOT NULL,
  current_license text NOT NULL,
  current_year text NOT NULL,
  current_make text NOT NULL,
  current_model text NOT NULL,
  current_color text NOT NULL,
  date_due_back date,
  mileage_out text,
  fuel_gauge_out text,
  deposits text,
  sales_tax text DEFAULT '8.00',
  state_sales_tax text DEFAULT '7.00',
  fuel_charges text DEFAULT '5.99',
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rental_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to rental agreements"
  ON rental_agreements
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to rental agreements"
  ON rental_agreements
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to rental agreements"
  ON rental_agreements
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to rental agreements"
  ON rental_agreements
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rental_agreements_status ON rental_agreements(status);
CREATE INDEX IF NOT EXISTS idx_rental_agreements_created_at ON rental_agreements(created_at DESC);