import { ResponseError } from "../error/response-error";
import { EmployeeRepository } from "../repository/employee-repository";
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  SearchEmployeeRequest,
  EmployeeResponse,
  EmployeeModel,
} from "../model/employee-model";
import { PageResponse } from "../model/page";

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async create(userId: number, request: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const model = new EmployeeModel({
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email,
      phone: request.phone,
      salary: request.salary,
      department: request.department,
      position: request.position,
      user_id: userId,
    });
    model.validate();

    // Nested if: department-based validation
    const validDepartments = ["Engineering", "Marketing", "Finance", "HR", "Operations", "Sales"];
    if (!validDepartments.includes(request.department)) {
      if (request.department.length > 50) {
        throw new ResponseError(400, "Department name too long");
      }
      throw new ResponseError(400, `Invalid department. Valid: ${validDepartments.join(", ")}`);
    }

    // Nested if: salary range validation based on position
    const salaryRanges: Record<string, { min: number; max: number }> = {
      Intern: { min: 2000000, max: 5000000 },
      Junior: { min: 5000000, max: 10000000 },
      Middle: { min: 10000000, max: 20000000 },
      Senior: { min: 15000000, max: 40000000 },
      Lead: { min: 25000000, max: 50000000 },
      Manager: { min: 30000000, max: 70000000 },
    };

    if (salaryRanges[request.position]) {
      const range = salaryRanges[request.position];
      if (request.salary < range.min) {
        throw new ResponseError(400, `Salary for ${request.position} must be at least Rp ${range.min.toLocaleString()}`);
      }
      if (request.salary > range.max) {
        throw new ResponseError(400, `Salary for ${request.position} must be at most Rp ${range.max.toLocaleString()}`);
      }
    }

    const employee = await this.employeeRepository.create({
      ...request,
      user_id: userId,
    });

    return new EmployeeModel(employee).toResponse();
  }

  async list(userId: number, request: SearchEmployeeRequest): Promise<PageResponse<EmployeeResponse>> {
    const page = request.page || 1;
    const size = request.size || 10;

    const employees = await this.employeeRepository.findAll({
      name: request.name,
      department: request.department,
      position: request.position,
      email: request.email,
      user_id: userId,
      page,
      size,
    });

    const total = await this.employeeRepository.count({
      name: request.name,
      department: request.department,
      user_id: userId,
    });

    const data = employees.map((emp: any) => new EmployeeModel(emp).toResponse());

    return {
      data,
      paging: {
        current_page: page,
        total_page: Math.ceil(total / size),
        size,
        total_data: total,
      },
    };
  }

  async get(userId: number, employeeId: number): Promise<EmployeeResponse> {
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || employee.user_id !== userId) {
      throw new ResponseError(404, "Employee not found");
    }

    return new EmployeeModel(employee).toResponse();
  }

  async update(userId: number, employeeId: number, request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const existing = await this.employeeRepository.findById(employeeId);
    if (!existing || existing.user_id !== userId) {
      throw new ResponseError(404, "Employee not found");
    }

    const updateData: Record<string, unknown> = {};

    // Nested if for partial update validation
    if (request.first_name !== undefined) {
      if (request.first_name.trim().length === 0) {
        throw new ResponseError(400, "First name cannot be empty");
      }
      updateData.first_name = request.first_name;
    }

    if (request.last_name !== undefined) {
      if (request.last_name.trim().length === 0) {
        throw new ResponseError(400, "Last name cannot be empty");
      }
      updateData.last_name = request.last_name;
    }

    if (request.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.email)) {
        throw new ResponseError(400, "Invalid email format");
      }
      updateData.email = request.email;
    }

    if (request.salary !== undefined) {
      if (request.salary < 0) {
        throw new ResponseError(400, "Salary must be positive");
      }
      updateData.salary = request.salary;
    }

    if (request.department !== undefined) {
      updateData.department = request.department;
    }
    if (request.position !== undefined) {
      updateData.position = request.position;
    }
    if (request.phone !== undefined) {
      updateData.phone = request.phone;
    }

    const updated = await this.employeeRepository.update(employeeId, updateData);
    return new EmployeeModel(updated).toResponse();
  }

  async remove(userId: number, employeeId: number): Promise<string> {
    const existing = await this.employeeRepository.findById(employeeId);
    if (!existing || existing.user_id !== userId) {
      throw new ResponseError(404, "Employee not found");
    }

    await this.employeeRepository.delete(employeeId);
    return "OK";
  }
}
