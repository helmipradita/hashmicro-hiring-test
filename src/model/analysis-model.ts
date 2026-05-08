import { BaseModel } from "./base-model";

export type CaseType = "sensitive" | "insensitive";

export class AnalysisModel extends BaseModel {
  public id?: number;
  public input1: string;
  public input2: string;
  public case_type: CaseType;
  public result_percentage: number;
  public unique_chars: string;
  public matched_chars: string;
  public user_id?: number;

  constructor(data: {
    id?: number;
    input1: string;
    input2: string;
    case_type: CaseType;
    result_percentage?: number;
    unique_chars?: string;
    matched_chars?: string;
    user_id?: number;
  }) {
    super();
    this.id = data.id;
    this.input1 = data.input1;
    this.input2 = data.input2;
    this.case_type = data.case_type;
    this.result_percentage = data.result_percentage ?? 0;
    this.unique_chars = data.unique_chars ?? "";
    this.matched_chars = data.matched_chars ?? "";
    this.user_id = data.user_id;
  }

  validate(): void {
    this.validateRequired(this.input1, "Input 1");
    this.validateRequired(this.input2, "Input 2");
    if (this.case_type !== "sensitive" && this.case_type !== "insensitive") {
      throw new Error("Case type must be 'sensitive' or 'insensitive'");
    }
  }

  toResponse(): AnalysisResponse {
    return {
      id: this.id!,
      input1: this.input1,
      input2: this.input2,
      case_type: this.case_type,
      result_percentage: this.result_percentage,
      unique_chars: this.unique_chars,
      matched_chars: this.matched_chars,
    };
  }
}

export interface AnalysisResponse {
  id: number;
  input1: string;
  input2: string;
  case_type: CaseType;
  result_percentage: number;
  unique_chars: string;
  matched_chars: string;
}

export interface AnalysisRequest {
  input1: string;
  input2: string;
  case_type: CaseType;
}

export interface SalaryRequest {
  employee_id: number;
  period: string;
}

export interface SalaryResponse {
  id: number;
  employee_id: number;
  base_salary: number;
  bonus: number;
  tax: number;
  deductions: number;
  net_salary: number;
  period: string;
}
