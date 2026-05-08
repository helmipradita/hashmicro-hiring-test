import { BaseRepository } from "./base-repository";

export class SalaryRepository extends BaseRepository<any> {
  async findById(id: number): Promise<any | null> {
    return this.prisma.salaryRecord.findUnique({
      where: { id },
      include: { employee: true },
    });
  }

  async findAll(params?: Record<string, unknown>): Promise<any[]> {
    return this.prisma.salaryRecord.findMany({
      where: {
        employee_id: params?.employee_id as number,
      },
      orderBy: { id: "desc" },
    });
  }

  async findByEmployeeId(employeeId: number): Promise<any[]> {
    return this.prisma.salaryRecord.findMany({
      where: { employee_id: employeeId },
      orderBy: { id: "desc" },
    });
  }

  async create(data: Record<string, unknown>): Promise<any> {
    return this.prisma.salaryRecord.create({
      data: {
        employee_id: data.employee_id as number,
        base_salary: data.base_salary as number,
        bonus: data.bonus as number,
        tax: data.tax as number,
        deductions: data.deductions as number,
        net_salary: data.net_salary as number,
        period: data.period as string,
      },
    });
  }

  async update(id: number, data: Record<string, unknown>): Promise<any> {
    return this.prisma.salaryRecord.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.salaryRecord.delete({
      where: { id },
    });
  }
}
