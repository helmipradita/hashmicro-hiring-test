import { BaseRepository } from "./base-repository";
import { Prisma } from "@prisma/client";

export class EmployeeRepository extends BaseRepository<any> {
  async findById(id: number): Promise<any | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async findAll(params?: Record<string, unknown>): Promise<any[]> {
    const where: Prisma.EmployeeWhereInput = {};

    if (params?.name) {
      where.OR = [
        { first_name: { contains: params.name as string } },
        { last_name: { contains: params.name as string } },
      ];
    }
    if (params?.department) {
      where.department = { contains: params.department as string };
    }
    if (params?.position) {
      where.position = { contains: params.position as string };
    }
    if (params?.email) {
      where.email = { contains: params.email as string };
    }
    if (params?.user_id) {
      where.user_id = params.user_id as number;
    }

    return this.prisma.employee.findMany({
      where,
      skip: ((params?.page as number) - 1) * (params?.size as number) || 0,
      take: (params?.size as number) || 10,
    });
  }

  async count(params?: Record<string, unknown>): Promise<number> {
    const where: Prisma.EmployeeWhereInput = {};

    if (params?.name) {
      where.OR = [
        { first_name: { contains: params.name as string } },
        { last_name: { contains: params.name as string } },
      ];
    }
    if (params?.department) {
      where.department = { contains: params.department as string };
    }
    if (params?.user_id) {
      where.user_id = params.user_id as number;
    }

    return this.prisma.employee.count({ where });
  }

  async create(data: Record<string, unknown>): Promise<any> {
    return this.prisma.employee.create({
      data: {
        first_name: data.first_name as string,
        last_name: data.last_name as string,
        email: data.email as string,
        phone: data.phone as string,
        salary: data.salary as number,
        department: data.department as string,
        position: data.position as string,
        user_id: data.user_id as number,
      },
    });
  }

  async update(id: number, data: Record<string, unknown>): Promise<any> {
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
