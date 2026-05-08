import { AnalysisRepository } from "../repository/analysis-repository";
import { AnalysisRequest, AnalysisResponse, AnalysisModel, CaseType } from "../model/analysis-model";
import { StrategyFactory } from "../strategy/strategy-factory";

export class AnalysisService {
  private analysisRepository: AnalysisRepository;

  constructor() {
    this.analysisRepository = new AnalysisRepository();
  }

  async analyze(userId: number, request: AnalysisRequest): Promise<AnalysisResponse> {
    const model = new AnalysisModel({
      input1: request.input1,
      input2: request.input2,
      case_type: request.case_type as CaseType,
    });
    model.validate();

    // Strategy Pattern: get appropriate strategy
    const strategy = StrategyFactory.getStrategy(request.case_type);
    const result = strategy.compare(request.input1, request.input2);

    const saved = await this.analysisRepository.create({
      input1: request.input1,
      input2: request.input2,
      case_type: request.case_type,
      result_percentage: result.percentage,
      unique_chars: result.uniqueChars.join(", "),
      matched_chars: result.matchedChars.join(", "),
      user_id: userId,
    });

    return new AnalysisModel({
      id: saved.id,
      input1: saved.input1,
      input2: saved.input2,
      case_type: saved.case_type as CaseType,
      result_percentage: saved.result_percentage,
      unique_chars: saved.unique_chars,
      matched_chars: saved.matched_chars,
    }).toResponse();
  }

  async getHistory(userId: number): Promise<AnalysisResponse[]> {
    const results = await this.analysisRepository.findByUserId(userId);
    return results.map((r: any) =>
      new AnalysisModel({
        id: r.id,
        input1: r.input1,
        input2: r.input2,
        case_type: r.case_type as CaseType,
        result_percentage: r.result_percentage,
        unique_chars: r.unique_chars,
        matched_chars: r.matched_chars,
      }).toResponse()
    );
  }
}
