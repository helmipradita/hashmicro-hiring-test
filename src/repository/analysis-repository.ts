import { BaseRepository } from "./base-repository";

export class AnalysisRepository extends BaseRepository<any> {
  async findById(id: number): Promise<any | null> {
    return this.prisma.analysisResult.findUnique({
      where: { id },
    });
  }

  async findAll(params?: Record<string, unknown>): Promise<any[]> {
    return this.prisma.analysisResult.findMany({
      where: {
        user_id: params?.user_id as number,
      },
      orderBy: { id: "desc" },
    });
  }

  async findByUserId(userId: number): Promise<any[]> {
    return this.prisma.analysisResult.findMany({
      where: { user_id: userId },
      orderBy: { id: "desc" },
    });
  }

  async create(data: Record<string, unknown>): Promise<any> {
    return this.prisma.analysisResult.create({
      data: {
        input1: data.input1 as string,
        input2: data.input2 as string,
        case_type: data.case_type as string,
        result_percentage: data.result_percentage as number,
        unique_chars: data.unique_chars as string,
        matched_chars: data.matched_chars as string,
        user_id: data.user_id as number,
      },
    });
  }

  async update(id: number, data: Record<string, unknown>): Promise<any> {
    return this.prisma.analysisResult.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.analysisResult.delete({
      where: { id },
    });
  }
}
