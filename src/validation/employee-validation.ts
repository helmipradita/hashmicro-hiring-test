import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required").max(20),
  salary: z.number().positive("Salary must be positive"),
  department: z.string().min(1, "Department is required").max(50),
  position: z.string().min(1, "Position is required").max(50),
});

export const UpdateEmployeeSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(20).optional(),
  salary: z.number().positive().optional(),
  department: z.string().min(1).max(50).optional(),
  position: z.string().min(1).max(50).optional(),
});
