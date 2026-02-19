import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
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
