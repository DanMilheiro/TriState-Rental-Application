import type { Express } from "express";
import { createServer, type Server } from "http";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/vehicles", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const { make, model, year, plate, vin, status, type, color, mileage } = req.body;

      const { data, error } = await supabase
        .from("vehicles")
        .insert({
          make,
          model,
          year,
          plate,
          vin,
          status: status || 'In-House',
          type,
          color,
          mileage
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { make, model, year, plate, vin, status, type, color, mileage } = req.body;

      const { data, error } = await supabase
        .from("vehicles")
        .update({
          make,
          model,
          year,
          plate,
          vin,
          status,
          type,
          color,
          mileage,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  app.get("/api/agreements", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("rental_agreements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching agreements:", error);
      res.status(500).json({ error: "Failed to fetch agreements" });
    }
  });

  app.get("/api/agreements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("rental_agreements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "Agreement not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching agreement:", error);
      res.status(500).json({ error: "Failed to fetch agreement" });
    }
  });

  app.post("/api/agreements", async (req, res) => {
    try {
      const { data: lastAgreement } = await supabase
        .from("rental_agreements")
        .select("agreement_number")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let nextNumber = 1;
      if (lastAgreement?.agreement_number) {
        const match = lastAgreement.agreement_number.match(/AGR-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const agreementNumber = `AGR-${String(nextNumber).padStart(3, '0')}`;

      const agreementData = {
        agreement_number: agreementNumber,
        renter_name: req.body.renterName,
        renter_address: req.body.address,
        renter_city: req.body.city,
        renter_state: req.body.state,
        renter_zip_code: req.body.zipCode,
        renter_phone: req.body.cellPhone,
        renter_email: req.body.email,
        drivers_license: req.body.driversLicense,
        license_state: req.body.licenseState,
        license_expiration: req.body.licenseExpiration,
        date_of_birth: req.body.dateOfBirth,
        insurance_company: req.body.insuranceCompany,
        policy_number: req.body.policyNumber,
        policy_expiration: req.body.policyExpiration,
        insurance_agent: req.body.insuranceAgent || null,
        agent_phone: req.body.agentPhone || null,
        adjuster: req.body.adjuster || null,
        adjuster_phone: req.body.adjusterPhone || null,
        claim_number: req.body.claimNumber || null,
        date_of_loss: req.body.dateOfLoss || null,
        original_car_number: req.body.originalCarNumber || null,
        original_license: req.body.originalLicense || null,
        original_year: req.body.originalYear || null,
        original_make: req.body.originalMake || null,
        original_model: req.body.originalModel || null,
        original_color: req.body.originalColor || null,
        current_car_number: req.body.currentCarNumber,
        current_license: req.body.currentLicense,
        current_year: req.body.currentYear,
        current_make: req.body.currentMake,
        current_model: req.body.currentModel,
        current_color: req.body.currentColor,
        date_due_back: req.body.dateDueBack || null,
        mileage_out: req.body.mileageOut || null,
        fuel_gauge_out: req.body.fuelGaugeOut || null,
        deposits: req.body.deposits || null,
        sales_tax: req.body.salesTax || '8.00',
        state_sales_tax: req.body.stateSalesTax || '7.00',
        fuel_charges: req.body.fuelCharges || '5.99',
        status: 'Active'
      };

      const { data, error } = await supabase
        .from("rental_agreements")
        .insert(agreementData)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error("Error creating agreement:", error);
      res.status(500).json({ error: "Failed to create agreement" });
    }
  });

  app.put("/api/agreements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (status) {
        updateData.status = status;
      }

      const { data, error } = await supabase
        .from("rental_agreements")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "Agreement not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error updating agreement:", error);
      res.status(500).json({ error: "Failed to update agreement" });
    }
  });


  return httpServer;
}
