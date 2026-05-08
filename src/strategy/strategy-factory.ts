import { CaseStrategy } from "./case-strategy";
import { SensitiveCaseStrategy } from "./sensitive-case";
import { InsensitiveCaseStrategy } from "./insensitive-case";
import { CaseType } from "../model/analysis-model";

export class StrategyFactory {
  private static strategies = new Map<CaseType, CaseStrategy>([
    ["sensitive", new SensitiveCaseStrategy()],
    ["insensitive", new InsensitiveCaseStrategy()],
  ]);

  public static getStrategy(caseType: CaseType): CaseStrategy {
    const strategy = this.strategies.get(caseType);
    if (!strategy) {
      throw new Error(`Unknown case type: ${caseType}`);
    }
    return strategy;
  }
}
