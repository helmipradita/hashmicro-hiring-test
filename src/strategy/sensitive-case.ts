import { CaseStrategy, CompareResult } from "./case-strategy";

export class SensitiveCaseStrategy implements CaseStrategy {
  compare(input1: string, input2: string): CompareResult {
    const uniqueChars = this.getUniqueChars(input1);
    const matchedChars: string[] = [];

    // Nested loop: iterate unique chars, then check each char against input2
    for (let i = 0; i < uniqueChars.length; i++) {
      let found = false;
      for (let j = 0; j < input2.length; j++) {
        if (uniqueChars[i] === input2[j]) {
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

    // Nested loop to find unique characters preserving order
    for (let i = 0; i < input.length; i++) {
      let isDuplicate = false;
      for (let j = 0; j < i; j++) {
        if (input[i] === input[j]) {
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
