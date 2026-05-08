import { z } from "zod";

export const AnalysisSchema = z.object({
  input1: z.string().min(1, "Input 1 is required").max(500),
  input2: z.string().min(1, "Input 2 is required").max(500),
  case_type: z.enum(["sensitive", "insensitive"], {
    errorMap: () => ({ message: "Case type must be 'sensitive' or 'insensitive'" }),
  }),
});

export const SalarySchema = z.object({
  employee_id: z.number().int().positive("Employee ID must be positive"),
  period: z.string().min(1, "Period is required").max(20),
});
