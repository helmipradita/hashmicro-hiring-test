import { BaseModel } from "./base-model";

export class EmployeeModel extends BaseModel {
  public id?: number;
  public first_name: string;
  public last_name: string;
  public email: string;
  public phone: string;
  public salary: number;
  public department: string;
  public position: string;
  public user_id?: number;

  constructor(data: {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    salary: number;
    department: string;
    position: string;
    user_id?: number;
  }) {
    super();
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.phone = data.phone;
    this.salary = data.salary;
    this.department = data.department;
    this.position = data.position;
    this.user_id = data.user_id;
  }

  validate(): void {
    this.validateRequired(this.first_name, "First name");
    this.validateRequired(this.last_name, "Last name");
    this.validateRequired(this.email, "Email");
    this.validateEmail(this.email);
    this.validateRequired(this.phone, "Phone");
    this.validatePositiveNumber(this.salary, "Salary");
    this.validateRequired(this.department, "Department");
    this.validateRequired(this.position, "Position");
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  toResponse(): EmployeeResponse {
    return {
      id: this.id!,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      salary: this.salary,
      department: this.department,
      position: this.position,
    };
  }
}

export interface EmployeeResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  salary: number;
  department: string;
  position: string;
}

export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  salary: number;
  department: string;
  position: string;
}

export interface UpdateEmployeeRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  salary?: number;
  department?: string;
  position?: string;
}

export interface SearchEmployeeRequest {
  name?: string;
  department?: string;
  position?: string;
  email?: string;
  page?: number;
  size?: number;
}
