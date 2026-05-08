import { CaseStrategy, CompareResult } from "./case-strategy";

export class InsensitiveCaseStrategy implements CaseStrategy {
  compare(input1: string, input2: string): CompareResult {
    const uniqueChars = this.getUniqueChars(input1);
    const input2Lower = input2.toLowerCase();
    const matchedChars: string[] = [];

    // Nested loop: iterate unique chars, then check each char against input2
    for (let i = 0; i < uniqueChars.length; i++) {
      let found = false;
      const charLower = uniqueChars[i].toLowerCase();
      for (let j = 0; j < input2Lower.length; j++) {
        if (charLower === input2Lower[j]) {
          // Nested if: check if char not already matched
          if (!found) {
            matchedChars.push(uniqueChars[i]);
            found = true;
          }
        }
      }
    }

    const percentage = input1.length > 0
      ? Math.round((matchedChars.length / input1.length) * 100)
      : 0;

    return {
      uniqueChars,
      matchedChars,
      percentage,
      totalUniqueChars: uniqueChars.length,
      totalMatchedChars: matchedChars.length,
    };
  }

  private getUniqueChars(input: string): string[] {
    const result: string[] = [];

    // Nested loop to find unique characters (case-insensitive dedup, preserving original case)
    for (let i = 0; i < input.length; i++) {
      let isDuplicate = false;
      const charLower = input[i].toLowerCase();
      for (let j = 0; j < i; j++) {
        if (input[j].toLowerCase() === charLower) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        result.push(input[i]);
      }
    }

    return result;
  }
}
