import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: text("employee_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanNumber: text("loan_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerAccount: text("customer_account").notNull(),
  amount: integer("amount").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const transferRequests = pgTable("transfer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: text("transaction_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerAccount: text("customer_account").notNull(),
  amount: integer("amount").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  employeeId: true,
  password: true,
  name: true,
  role: true,
});

export const loginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const securityAnswerSchema = z.object({
  answer: z.string().min(1, "Security answer is required"),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type TransferRequest = typeof transferRequests.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type OTPData = z.infer<typeof otpSchema>;
export type SecurityAnswerData = z.infer<typeof securityAnswerSchema>;
