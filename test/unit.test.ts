import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { SensitiveCaseStrategy } from "../src/strategy/sensitive-case";
import { InsensitiveCaseStrategy } from "../src/strategy/insensitive-case";
import { StrategyFactory } from "../src/strategy/strategy-factory";

describe("SensitiveCaseStrategy", () => {
  const strategy = new SensitiveCaseStrategy();

  it("SOAL CASE 1: ABBCD vs Gallant Duck = 20%", () => {
    const result = strategy.compare("ABBCD", "Gallant Duck");
    expect(result.percentage).toBe(20);
    expect(result.matchedChars).toEqual(["D"]);
    expect(result.uniqueChars).toEqual(["A", "B", "C", "D"]);
    expect(result.totalUniqueChars).toBe(4);
    expect(result.totalMatchedChars).toBe(1);
  });

  it("all chars match - HELLO vs HELLO WORLD", () => {
    const result = strategy.compare("HELLO", "HELLO WORLD");
    expect(result.percentage).toBe(80); // 4/5
    expect(result.matchedChars).toEqual(["H", "E", "L", "O"]);
  });

  it("no chars match - XYZ vs Hello World", () => {
    const result = strategy.compare("XYZ", "Hello World");
    expect(result.percentage).toBe(0);
    expect(result.matchedChars).toEqual([]);
  });

  it("case difference - abc vs ABC = 0%", () => {
    const result = strategy.compare("abc", "ABC");
    expect(result.percentage).toBe(0);
  });

  it("numbers as characters - 123 vs a1b2c3 = 100%", () => {
    const result = strategy.compare("123", "a1b2c3");
    expect(result.percentage).toBe(100);
  });

  it("single char match - ABCDE vs A = 20%", () => {
    const result = strategy.compare("ABCDE", "A");
    expect(result.percentage).toBe(20);
  });

  it("duplicate chars - AAA vs Apple", () => {
    const result = strategy.compare("AAA", "Apple");
    expect(result.percentage).toBe(33); // 1/3 = 33%
    expect(result.matchedChars).toEqual(["A"]);
  });
});

describe("InsensitiveCaseStrategy", () => {
  const strategy = new InsensitiveCaseStrategy();

  it("SOAL CASE 2: ABBCD vs Gallant Duck = 60%", () => {
    const result = strategy.compare("ABBCD", "Gallant Duck");
    expect(result.percentage).toBe(60);
    expect(result.matchedChars).toEqual(["A", "C", "D"]);
    expect(result.uniqueChars).toEqual(["A", "B", "C", "D"]);
    expect(result.totalUniqueChars).toBe(4);
    expect(result.totalMatchedChars).toBe(3);
  });

  it("case difference - abc vs ABC = 100%", () => {
    const result = strategy.compare("abc", "ABC");
    expect(result.percentage).toBe(100);
  });

  it("special characters - A@B C vs a@b c test = 100%", () => {
    const result = strategy.compare("A@B C", "a@b c test");
    expect(result.percentage).toBe(100);
  });
});

describe("StrategyFactory", () => {
  it("returns SensitiveCaseStrategy for 'sensitive'", () => {
    const strategy = StrategyFactory.getStrategy("sensitive");
    expect(strategy).toBeInstanceOf(SensitiveCaseStrategy);
  });

  it("returns InsensitiveCaseStrategy for 'insensitive'", () => {
    const strategy = StrategyFactory.getStrategy("insensitive");
    expect(strategy).toBeInstanceOf(InsensitiveCaseStrategy);
  });

  it("throws error for unknown case type", () => {
    expect(() => StrategyFactory.getStrategy("unknown" as any)).toThrow("Unknown case type");
  });
});

describe("BaseModel - Validation helpers", () => {
  it("EmployeeModel validates correctly", async () => {
    const { EmployeeModel } = await import("../src/model/employee-model");
    const model = new (EmployeeModel as any)({
      first_name: "",
      last_name: "Doe",
      email: "bad",
      phone: "123",
      salary: -100,
      department: "",
      position: "",
    });
    expect(() => model.validate()).toThrow();
  });

  it("EmployeeModel validates valid data", async () => {
    const { EmployeeModel } = await import("../src/model/employee-model");
    const model = new (EmployeeModel as any)({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "081234567890",
      salary: 15000000,
      department: "Engineering",
      position: "Senior",
    });
    expect(() => model.validate()).not.toThrow();
  });

  it("UserModel validates short password", async () => {
    const { UserModel } = await import("../src/model/user-model");
    const model = new (UserModel as any)("admin", "123", "Test");
    expect(() => model.validate()).toThrow("Password must be at least 6 characters");
  });

  it("UserModel validates short username", async () => {
    const { UserModel } = await import("../src/model/user-model");
    const model = new (UserModel as any)("ab", "password", "Test");
    expect(() => model.validate()).toThrow("Username must be at least 3 characters");
  });
});
