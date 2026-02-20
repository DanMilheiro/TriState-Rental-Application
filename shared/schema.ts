import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, uuid, date, bigint, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  plate: text("plate").notNull().unique(),
  vin: text("vin"),
  status: text("status").notNull().default("In-House"),
  type: text("type").notNull(),
  color: text("color"),
  mileage: integer("mileage"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVehicleSchema = createInsertSchema(vehicles, {
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  plate: z.string().min(1, "License plate is required"),
  type: z.string().min(1, "Vehicle type is required"),
  status: z.enum(["In-House", "Loaned", "Maintenance"]).default("In-House"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectVehicleSchema = createSelectSchema(vehicles);

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export const rentalAgreements = pgTable("rental_agreements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  agreementNumber: text("agreement_number").notNull().unique(),
  renterName: text("renter_name").notNull(),
  renterAddress: text("renter_address").notNull(),
  renterCity: text("renter_city").notNull(),
  renterState: text("renter_state").notNull(),
  renterZipCode: text("renter_zip_code").notNull(),
  renterPhone: text("renter_phone").notNull(),
  renterEmail: text("renter_email").notNull(),
  driversLicense: text("drivers_license").notNull(),
  licenseState: text("license_state").notNull(),
  licenseExpiration: date("license_expiration").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  insuranceCompany: text("insurance_company").notNull(),
  policyNumber: text("policy_number").notNull(),
  policyExpiration: date("policy_expiration").notNull(),
  insuranceAgent: text("insurance_agent"),
  agentPhone: text("agent_phone"),
  adjuster: text("adjuster"),
  adjusterPhone: text("adjuster_phone"),
  claimNumber: text("claim_number"),
  dateOfLoss: date("date_of_loss"),
  originalCarNumber: text("original_car_number"),
  originalLicense: text("original_license"),
  originalYear: text("original_year"),
  originalMake: text("original_make"),
  originalModel: text("original_model"),
  originalColor: text("original_color"),
  currentCarNumber: text("current_car_number").notNull(),
  currentLicense: text("current_license").notNull(),
  currentYear: text("current_year").notNull(),
  currentMake: text("current_make").notNull(),
  currentModel: text("current_model").notNull(),
  currentColor: text("current_color").notNull(),
  dateDueBack: date("date_due_back"),
  mileageOut: text("mileage_out"),
  fuelGaugeOut: text("fuel_gauge_out"),
  deposits: text("deposits"),
  salesTax: text("sales_tax").default("8.00"),
  stateSalesTax: text("state_sales_tax").default("7.00"),
  fuelCharges: text("fuel_charges").default("5.99"),
  status: text("status").default("Active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertRentalAgreementSchema = createInsertSchema(rentalAgreements, {
  renterName: z.string().min(1, "Renter name is required"),
  renterAddress: z.string().min(1, "Address is required"),
  renterCity: z.string().min(1, "City is required"),
  renterState: z.string().min(1, "State is required"),
  renterZipCode: z.string().min(1, "Zip code is required"),
  renterPhone: z.string().min(1, "Phone is required"),
  renterEmail: z.string().email("Valid email is required"),
  driversLicense: z.string().min(1, "Driver's license is required"),
  licenseState: z.string().min(1, "License state is required"),
  insuranceCompany: z.string().min(1, "Insurance company is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  currentCarNumber: z.string().min(1, "Current car number is required"),
  currentLicense: z.string().min(1, "Current license plate is required"),
  currentYear: z.string().min(1, "Current year is required"),
  currentMake: z.string().min(1, "Current make is required"),
  currentModel: z.string().min(1, "Current model is required"),
  currentColor: z.string().min(1, "Current color is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectRentalAgreementSchema = createSelectSchema(rentalAgreements);

export type InsertRentalAgreement = z.infer<typeof insertRentalAgreementSchema>;
export type RentalAgreement = typeof rentalAgreements.$inferSelect;

export const backupMetadata = pgTable("backup_metadata", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  agreementId: uuid("agreement_id").references(() => rentalAgreements.id),
  backupType: text("backup_type").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: bigint("file_size", { mode: "number" }).default(0),
  backupStatus: text("backup_status").notNull().default("pending"),
  errorMessage: text("error_message"),
  backupDate: timestamp("backup_date", { withTimezone: true }).defaultNow(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertBackupMetadataSchema = createInsertSchema(backupMetadata, {
  backupType: z.string().min(1, "Backup type is required"),
  filePath: z.string().min(1, "File path is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBackupMetadataSchema = createSelectSchema(backupMetadata);

export type InsertBackupMetadata = z.infer<typeof insertBackupMetadataSchema>;
export type BackupMetadata = typeof backupMetadata.$inferSelect;
