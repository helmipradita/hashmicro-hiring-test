import { PrismaClient } from "@prisma/client";
import { Database } from "../application/database";

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = Database.getInstance();
  }

  abstract findById(id: number): Promise<T | null>;
  abstract findAll(params?: Record<string, unknown>): Promise<T[]>;
  abstract create(data: Record<string, unknown>): Promise<T>;
  abstract update(id: number, data: Record<string, unknown>): Promise<T>;
  abstract delete(id: number): Promise<T>;
}
