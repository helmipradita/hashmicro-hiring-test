import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import supertest from "supertest";
import { web } from "../src/application/web";
import { Database } from "../src/application/database";

const BASE_URL = "/api";
let authToken: string;

// Refresh token helper - call this before each describe that needs auth
async function refreshToken(): Promise<string> {
  const res = await supertest(web)
    .post(`${BASE_URL}/users/login`)
    .send({ username: "testuser_jest", password: "test123456" });

  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.status} - ${JSON.stringify(res.body)}`);
  }

  authToken = res.body.token;
  return authToken;
}

// Register test user once before all tests
beforeAll(async () => {
  // Register (ignore if exists)
  await supertest(web)
    .post(`${BASE_URL}/users/register`)
    .send({ username: "testuser_jest", password: "test123456", name: "Jest Tester" });

  // Get initial token
  await refreshToken();
});

afterAll(async () => {
  const prisma = Database.getInstance();
  await prisma.$disconnect();
});

// ============================================================
// AUTH TESTS
// ============================================================
describe("POST /api/users/register", () => {
  it("should reject duplicate username - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/register`)
      .send({ username: "testuser_jest", password: "test123456", name: "Duplicate" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject missing username - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/register`)
      .send({ password: "test123456", name: "No User" });
    expect(res.status).toBe(400);
  });

  it("should reject short password - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/register`)
      .send({ username: "newuser" + Date.now(), password: "123", name: "Short Pass" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/users/login", () => {
  it("should login successfully - 200", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/login`)
      .send({ username: "testuser_jest", password: "test123456" });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe("testuser_jest");
    expect(res.body.token).toBeDefined();
  });

  it("should reject wrong password - 401", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/login`)
      .send({ username: "testuser_jest", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("should reject nonexistent user - 401", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/users/login`)
      .send({ username: "ghost_user_999", password: "nopassword" });
    expect(res.status).toBe(401);
  });
});

// ============================================================
// PROTECTED ROUTE TESTS - refresh token after auth tests
// ============================================================
describe("Protected Routes", () => {
  beforeAll(async () => {
    await refreshToken();
  });

  it("should reject request without token - 401", async () => {
    const res = await supertest(web).get(`${BASE_URL}/users/current`);
    expect(res.status).toBe(401);
  });

  it("should reject request with invalid token - 401", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/users/current`)
      .set("X-API-TOKEN", "fake-token-12345");
    expect(res.status).toBe(401);
  });

  it("GET /users/current - should get current user - 200", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/users/current`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe("testuser_jest");
  });
});

// ============================================================
// EMPLOYEE CRUD TESTS
// ============================================================
describe("Employee CRUD", () => {
  let employeeId: number;

  beforeAll(async () => {
    await refreshToken();
  });

  it("CREATE - should create employee - 201", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken)
      .send({
        first_name: "Jest",
        last_name: "Tester",
        email: `jest.${Date.now()}@example.com`,
        phone: "081234567890",
        salary: 15000000,
        department: "Engineering",
        position: "Senior",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.first_name).toBe("Jest");
    employeeId = res.body.data.id;
  });

  it("CREATE - should reject invalid department - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken)
      .send({
        first_name: "Test",
        last_name: "User",
        email: `test.${Date.now()}@example.com`,
        phone: "081234567890",
        salary: 10000000,
        department: "InvalidDept",
        position: "Junior",
      });
    expect(res.status).toBe(400);
  });

  it("CREATE - should reject invalid email - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken)
      .send({
        first_name: "Test",
        last_name: "Email",
        email: "not-an-email",
        phone: "081234567890",
        salary: 10000000,
        department: "Engineering",
        position: "Middle",
      });
    expect(res.status).toBe(400);
  });

  it("CREATE - should reject negative salary - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken)
      .send({
        first_name: "Test",
        last_name: "Negative",
        email: `neg.${Date.now()}@example.com`,
        phone: "081234567890",
        salary: -10000000,
        department: "Engineering",
        position: "Middle",
      });
    expect(res.status).toBe(400);
  });

  it("LIST - should list employees - 200", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.paging).toBeDefined();
  });

  it("GET - should get employee by ID - 200", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/employees/${employeeId}`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(employeeId);
  });

  it("GET - should return 404 for nonexistent employee", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/employees/999999`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(404);
  });

  it("UPDATE - should update employee salary - 200", async () => {
    const res = await supertest(web)
      .patch(`${BASE_URL}/employees/${employeeId}`)
      .set("X-API-TOKEN", authToken)
      .send({ salary: 20000000 });
    expect(res.status).toBe(200);
    expect(res.body.data.salary).toBe(20000000);
  });

  it("DELETE - should delete employee - 200", async () => {
    const res = await supertest(web)
      .delete(`${BASE_URL}/employees/${employeeId}`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("OK");
  });

  it("DELETE - should return 404 for already deleted employee", async () => {
    const res = await supertest(web)
      .delete(`${BASE_URL}/employees/${employeeId}`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(404);
  });
});

// ============================================================
// CHARACTER ANALYSIS TESTS (SOAL HASHMICRO)
// ============================================================
describe("Character Analysis - HashMicro Test Cases", () => {
  beforeAll(async () => {
    await refreshToken();
  });

  it("SOAL CASE 1: ABBCD vs Gallant Duck SENSITIVE = 20%", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "ABBCD", input2: "Gallant Duck", case_type: "sensitive" });
    expect(res.status).toBe(200);
    expect(res.body.data.result_percentage).toBe(20);
    expect(res.body.data.matched_chars).toBe("D");
  });

  it("SOAL CASE 2: ABBCD vs Gallant Duck INSENSITIVE = 60%", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "ABBCD", input2: "Gallant Duck", case_type: "insensitive" });
    expect(res.status).toBe(200);
    expect(res.body.data.result_percentage).toBe(60);
    expect(res.body.data.matched_chars).toBe("A, C, D");
  });

  it("No match - XYZ vs Hello World = 0%", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "XYZ", input2: "Hello World", case_type: "sensitive" });
    expect(res.status).toBe(200);
    expect(res.body.data.result_percentage).toBe(0);
  });

  it("Case diff sensitive - abc vs ABC = 0%", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "abc", input2: "ABC", case_type: "sensitive" });
    expect(res.status).toBe(200);
    expect(res.body.data.result_percentage).toBe(0);
  });

  it("Case diff insensitive - abc vs ABC = 100%", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "abc", input2: "ABC", case_type: "insensitive" });
    expect(res.status).toBe(200);
    expect(res.body.data.result_percentage).toBe(100);
  });

  it("Should reject invalid case_type - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "ABC", input2: "abc", case_type: "invalid" });
    expect(res.status).toBe(400);
  });

  it("Should reject empty input1 - 400", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/analysis`)
      .set("X-API-TOKEN", authToken)
      .send({ input1: "", input2: "Hello", case_type: "sensitive" });
    expect(res.status).toBe(400);
  });

  it("Should get analysis history - 200", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/analysis/history`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

// ============================================================
// SALARY CALCULATOR TESTS
// ============================================================
describe("Salary Calculator", () => {
  let salaryEmployeeId: number;

  beforeAll(async () => {
    await refreshToken();
    const res = await supertest(web)
      .post(`${BASE_URL}/employees`)
      .set("X-API-TOKEN", authToken)
      .send({
        first_name: "Salary",
        last_name: "Test",
        email: `salary.${Date.now()}@example.com`,
        phone: "081234567890",
        salary: 15000000,
        department: "Engineering",
        position: "Senior",
      });
    salaryEmployeeId = res.body.data.id;
  });

  it("should calculate salary - 200", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/salaries/calculate`)
      .set("X-API-TOKEN", authToken)
      .send({ employee_id: salaryEmployeeId, period: "2024-01" });
    expect(res.status).toBe(200);
    expect(res.body.data.base_salary).toBe(15000000);
    expect(res.body.data.bonus).toBeGreaterThan(0);
    expect(res.body.data.net_salary).toBeGreaterThan(0);
  });

  it("should reject nonexistent employee - 404", async () => {
    const res = await supertest(web)
      .post(`${BASE_URL}/salaries/calculate`)
      .set("X-API-TOKEN", authToken)
      .send({ employee_id: 999999, period: "2024-01" });
    expect(res.status).toBe(404);
  });

  it("should get salary history - 200", async () => {
    const res = await supertest(web)
      .get(`${BASE_URL}/salaries/employee/${salaryEmployeeId}`)
      .set("X-API-TOKEN", authToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
