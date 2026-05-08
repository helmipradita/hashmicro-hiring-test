import { BaseRepository } from "./base-repository";

export class UserRepository extends BaseRepository<any> {
  async findById(id: number): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        token: true,
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
  }

  async findByUsername(username: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByToken(token: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { token },
      select: {
        id: true,
        username: true,
        name: true,
        token: true,
      },
    });
  }

  async create(data: Record<string, unknown>): Promise<any> {
    return this.prisma.user.create({
      data: {
        username: data.username as string,
        password: data.password as string,
        name: data.name as string,
      },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
  }

  async update(id: number, data: Record<string, unknown>): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        name: true,
        token: true,
      },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
