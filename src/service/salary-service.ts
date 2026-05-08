import { ResponseError } from "../error/response-error";
import { EmployeeRepository } from "../repository/employee-repository";
import { SalaryRepository } from "../repository/salary-repository";
import { SalaryRequest, SalaryResponse } from "../model/analysis-model";

// Tax bracket configuration
const TAX_BRACKETS = [
  { min: 0, max: 50000000, rate: 0.05 },
  { min: 50000000, max: 250000000, rate: 0.15 },
  { min: 250000000, max: 500000000, rate: 0.25 },
  { min: 500000000, max: Infinity, rate: 0.30 },
];

// Bonus rates by department
const DEPARTMENT_BONUS_RATES: Record<string, number> = {
  Engineering: 0.15,
  Marketing: 0.10,
  Finance: 0.12,
  HR: 0.08,
  Operations: 0.10,
  Sales: 0.20,
};

// Deduction categories
const DEDUCTION_CATEGORIES = [
  { name: "BPJS Kesehatan", rate: 0.01 },
  { name: "BPJS Ketenagakerjaan", rate: 0.02 },
  { name: "Pension", rate: 0.01 },
];

export class SalaryService {
  private employeeRepository: EmployeeRepository;
  private salaryRepository: SalaryRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.salaryRepository = new SalaryRepository();
  }

  async calculateSalary(userId: number, request: SalaryRequest): Promise<SalaryResponse> {
    const employee = await this.employeeRepository.findById(request.employee_id);
    if (!employee || employee.user_id !== userId) {
      throw new ResponseError(404, "Employee not found");
    }

    const baseSalary = employee.salary;

    // Mathematics: Calculate bonus using nested loop
    let bonusRate = 0;
    for (const [dept, rate] of Object.entries(DEPARTMENT_BONUS_RATES)) {
      // Nested if for department matching
      if (dept === employee.department) {
        // Nested loop: check position multiplier
        const positionMultipliers: Record<string, number> = {
          Intern: 0.5,
          Junior: 0.8,
          Middle: 1.0,
          Senior: 1.2,
          Lead: 1.5,
          Manager: 1.8,
        };
        for (const [pos, mult] of Object.entries(positionMultipliers)) {
          if (pos === employee.position) {
            bonusRate = rate * mult;
            break;
          }
        }
        break;
      }
    }

    const bonus = Math.round(baseSalary * bonusRate);

    // Mathematics: Progressive tax calculation using nested loop
    let tax = 0;
    let remainingIncome = baseSalary * 12; // Annual income
    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const bracket = TAX_BRACKETS[i];
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min
      );

      // Nested if for bracket validation
      if (taxableInBracket > 0) {
        const bracketTax = taxableInBracket * bracket.rate;
        tax += bracketTax;
        remainingIncome -= taxableInBracket;
      }
    }
    tax = Math.round(tax / 12); // Monthly tax

    // Mathematics: Calculate deductions using nested loop
    let deductions = 0;
    for (let i = 0; i < DEDUCTION_CATEGORIES.length; i++) {
      const deduction = Math.round(baseSalary * DEDUCTION_CATEGORIES[i].rate);
      // Nested if: validate deduction doesn't exceed cap
      if (deduction > 0) {
        const maxDeduction = baseSalary * 0.05;
        if (deduction > maxDeduction) {
          deductions += maxDeduction;
        } else {
          deductions += deduction;
        }
      }
    }
    deductions = Math.round(deductions);

    // Mathematics: Net salary calculation
    const netSalary = Math.round(baseSalary + bonus - tax - deductions);

    const record = await this.salaryRepository.create({
      employee_id: request.employee_id,
      base_salary: baseSalary,
      bonus,
      tax,
      deductions,
      net_salary: netSalary,
      period: request.period,
    });

    return {
      id: record.id,
      employee_id: record.employee_id,
      base_salary: record.base_salary,
      bonus: record.bonus,
      tax: record.tax,
      deductions: record.deductions,
      net_salary: record.net_salary,
      period: record.period,
    };
  }

  async getSalaryHistory(userId: number, employeeId: number): Promise<SalaryResponse[]> {
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || employee.user_id !== userId) {
      throw new ResponseError(404, "Employee not found");
    }

    const records = await this.salaryRepository.findByEmployeeId(employeeId);
    return records.map((r: any) => ({
      id: r.id,
      employee_id: r.employee_id,
      base_salary: r.base_salary,
      bonus: r.bonus,
      tax: r.tax,
      deductions: r.deductions,
      net_salary: r.net_salary,
      period: r.period,
    }));
  }
}
