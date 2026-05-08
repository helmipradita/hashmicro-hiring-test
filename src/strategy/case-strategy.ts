export interface CaseStrategy {
  compare(input1: string, input2: string): CompareResult;
}

export interface CompareResult {
  uniqueChars: string[];
  matchedChars: string[];
  percentage: number;
  totalUniqueChars: number;
  totalMatchedChars: number;
}
