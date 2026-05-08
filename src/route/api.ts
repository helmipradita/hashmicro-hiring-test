import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { EmployeeController } from "../controller/employee-controller";
import { AnalysisController } from "../controller/analysis-controller";
import { Validation } from "../validation/validation";
import { UpdateUserSchema } from "../validation/user-validation";
import { CreateEmployeeSchema, UpdateEmployeeSchema } from "../validation/employee-validation";
import { AnalysisSchema, SalarySchema } from "../validation/analysis-validation";

const api = Router();
api.use(authMiddleware);

const userController = new UserController();
const employeeController = new EmployeeController();
const analysisController = new AnalysisController();

// ============================================================
// TAGS
// ============================================================

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User profile management (requires auth)
 *   - name: Employee
 *     description: Employee CRUD operations (requires auth)
 *   - name: Salary
 *     description: Salary calculation with mathematics (requires auth)
 *   - name: Analysis
 *     description: Character matching analysis - HashMicro test case (requires auth)
 */

// ============================================================
// USER ENDPOINTS
// ============================================================

/**
 * @openapi
 * /users/current:
 *   get:
 *     tags: [User]
 *     summary: Get current user profile
 *     security:
 *       - ApiToken: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *             example:
 *               data:
 *                 username: "admin"
 *                 name: "Administrator"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               No Token:
 *                 value:
 *                   errors: "Unauthorized: Token is required"
 *               Invalid Token:
 *                 value:
 *                   errors: "Unauthorized: Invalid token"
 */
api.get("/users/current", userController.get);

/**
 * @openapi
 * /users/current:
 *   patch:
 *     tags: [User]
 *     summary: Update current user profile
 *     security:
 *       - ApiToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             Update Name:
 *               value:
 *                 name: "Admin Updated"
 *             Update Password:
 *               value:
 *                 password: "newpassword123"
 *             Update Both:
 *               value:
 *                 name: "New Admin Name"
 *                 password: "newpassword123"
 *             Empty Name:
 *               summary: Empty name - will fail
 *               value:
 *                 name: ""
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *             example:
 *               data:
 *                 username: "admin"
 *                 name: "Admin Updated"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
api.patch("/users/current", (req, res, next) => {
  try {
    Validation.validate(UpdateUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.update);

/**
 * @openapi
 * /users/logout:
 *   delete:
 *     tags: [User]
 *     summary: Logout and invalidate token
 *     security:
 *       - ApiToken: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *             example:
 *               data: "OK"
 *       401:
 *         description: Unauthorized
 */
api.delete("/users/logout", userController.logout);

// ============================================================
// EMPLOYEE CRUD ENDPOINTS
// ============================================================

/**
 * @openapi
 * /employees:
 *   post:
 *     tags: [Employee]
 *     summary: Create a new employee
 *     description: |
 *       Create employee with department and position validation.
 *       Valid departments: Engineering, Marketing, Finance, HR, Operations, Sales
 *       Valid positions: Intern, Junior, Middle, Senior, Lead, Manager

 *       **Salary ranges by position:**
 *       | Position | Min (IDR) | Max (IDR) |
 *       |----------|-----------|-----------|
 *       | Intern   | 2,000,000 | 5,000,000 |
 *       | Junior   | 5,000,000 | 10,000,000 |
 *       | Middle   | 10,000,000| 20,000,000 |
 *       | Senior   | 15,000,000| 40,000,000 |
 *       | Lead     | 25,000,000| 50,000,000 |
 *       | Manager  | 30,000,000| 70,000,000 |
 *     security:
 *       - ApiToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *           examples:
 *             Engineering Senior:
 *               summary: Engineering Senior employee
 *               value:
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 email: "john@example.com"
 *                 phone: "081234567890"
 *                 salary: 15000000
 *                 department: "Engineering"
 *                 position: "Senior"
 *             Marketing Junior:
 *               summary: Marketing Junior employee
 *               value:
 *                 first_name: "Jane"
 *                 last_name: "Smith"
 *                 email: "jane@example.com"
 *                 phone: "081234567891"
 *                 salary: 7000000
 *                 department: "Marketing"
 *                 position: "Junior"
 *             Finance Manager:
 *               summary: Finance Manager employee
 *               value:
 *                 first_name: "Bob"
 *                 last_name: "Wilson"
 *                 email: "bob@example.com"
 *                 phone: "081234567892"
 *                 salary: 45000000
 *                 department: "Finance"
 *                 position: "Manager"
 *             Invalid Department:
 *               summary: Invalid department - will fail
 *               value:
 *                 first_name: "Test"
 *                 last_name: "User"
 *                 email: "test@example.com"
 *                 phone: "081234567899"
 *                 salary: 10000000
 *                 department: "InvalidDept"
 *                 position: "Junior"
 *             Salary Below Range:
 *               summary: Salary below position range - will fail
 *               value:
 *                 first_name: "Test"
 *                 last_name: "Low"
 *                 email: "testlow@example.com"
 *                 phone: "081234567895"
 *                 salary: 1000000
 *                 department: "Engineering"
 *                 position: "Senior"
 *             Invalid Email:
 *               summary: Invalid email format - will fail
 *               value:
 *                 first_name: "Test"
 *                 last_name: "Email"
 *                 email: "not-an-email"
 *                 phone: "081234567896"
 *                 salary: 10000000
 *                 department: "Engineering"
 *                 position: "Middle"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EmployeeResponse'
 *       400:
 *         description: Validation error, invalid department, or salary out of range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Invalid Department:
 *                 value:
 *                   errors: "Invalid department. Valid: Engineering, Marketing, Finance, HR, Operations, Sales"
 *               Salary Too Low:
 *                 value:
 *                   errors: "Salary for Senior must be at least Rp 15.000.000"
 *               Invalid Email:
 *                 value:
 *                   errors: "email: Invalid email"
 *               Duplicate Email:
 *                 value:
 *                   errors: "employees_email_key already exists"
 *       401:
 *         description: Unauthorized
 */
api.post("/employees", (req, res, next) => {
  try {
    Validation.validate(CreateEmployeeSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.create);

/**
 * @openapi
 * /employees:
 *   get:
 *     tags: [Employee]
 *     summary: List employees with search and pagination
 *     security:
 *       - ApiToken: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by first or last name (partial match)
 *         example: "John"
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department (partial match)
 *         example: "Engineering"
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position (partial match)
 *         example: "Senior"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by email (partial match)
 *         example: "john"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of employees with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeListResponse'
 *       401:
 *         description: Unauthorized
 */
api.get("/employees", employeeController.list);

/**
 * @openapi
 * /employees/{employeeId}:
 *   get:
 *     tags: [Employee]
 *     summary: Get employee by ID
 *     security:
 *       - ApiToken: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               errors: "Employee not found"
 *       401:
 *         description: Unauthorized
 */
api.get("/employees/:employeeId", employeeController.get);

/**
 * @openapi
 * /employees/{employeeId}:
 *   patch:
 *     tags: [Employee]
 *     summary: Update employee
 *     description: Partially update employee data. Only send fields you want to change.
 *     security:
 *       - ApiToken: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *           examples:
 *             Update Salary:
 *               value:
 *                 salary: 20000000
 *             Update Name & Salary:
 *               value:
 *                 first_name: "Johnny"
 *                 last_name: "Updated"
 *                 salary: 25000000
 *             Update Department:
 *               value:
 *                 department: "Marketing"
 *             Invalid Email:
 *               summary: Invalid email format - will fail
 *               value:
 *                 email: "bad-email"
 *             Negative Salary:
 *               summary: Negative salary - will fail
 *               value:
 *                 salary: -5000000
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EmployeeResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
api.patch("/employees/:employeeId", (req, res, next) => {
  try {
    Validation.validate(UpdateEmployeeSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.update);

/**
 * @openapi
 * /employees/{employeeId}:
 *   delete:
 *     tags: [Employee]
 *     summary: Delete employee
 *     description: Permanently delete an employee and all associated salary records.
 *     security:
 *       - ApiToken: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *             example:
 *               data: "OK"
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
api.delete("/employees/:employeeId", employeeController.remove);

// ============================================================
// SALARY ENDPOINTS
// ============================================================

/**
 * @openapi
 * /salaries/calculate:
 *   post:
 *     tags: [Salary]
 *     summary: Calculate employee salary
 *     description: |
 *       Calculate monthly salary with:
 *       - **Base salary** from employee data
 *       - **Bonus** = base × department_bonus_rate × position_multiplier
 *       - **Tax** = progressive tax (5%-30%) based on annual income
 *       - **Deductions** = BPJS Kesehatan (1%) + BPJS Ketenagakerjaan (2%) + Pension (1%)
 *       - **Net Salary** = base + bonus - tax - deductions

 *       **Bonus rates by department:** Engineering 15%, Marketing 10%, Finance 12%, HR 8%, Operations 10%, Sales 20%
 *       **Position multipliers:** Intern ×0.5, Junior ×0.8, Middle ×1.0, Senior ×1.2, Lead ×1.5, Manager ×1.8
 *     security:
 *       - ApiToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaryRequest'
 *           examples:
 *             Calculate January:
 *               value:
 *                 employee_id: 1
 *                 period: "2024-01"
 *             Calculate February:
 *               value:
 *                 employee_id: 1
 *                 period: "2024-02"
 *             Missing Period:
 *               summary: Missing period - will fail
 *               value:
 *                 employee_id: 1
 *     responses:
 *       200:
 *         description: Salary calculated and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *             example:
 *               data:
 *                 id: 1
 *                 employee_id: 1
 *                 base_salary: 15000000
 *                 bonus: 2700000
 *                 tax: 1833333
 *                 deductions: 600000
 *                 net_salary: 15266667
 *                 period: "2024-01"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
api.post("/salaries/calculate", (req, res, next) => {
  try {
    Validation.validate(SalarySchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.calculateSalary);

/**
 * @openapi
 * /salaries/employee/{employeeId}:
 *   get:
 *     tags: [Salary]
 *     summary: Get salary calculation history
 *     security:
 *       - ApiToken: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Salary history list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalaryResponse'
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
api.get("/salaries/employee/:employeeId", employeeController.getSalaryHistory);

// ============================================================
// ANALYSIS ENDPOINTS (CHARACTER MATCHING - SOAL HASHMICRO)
// ============================================================

/**
 * @openapi
 * /analysis:
 *   post:
 *     tags: [Analysis]
 *     summary: Analyze character matching between two strings
 *     description: |
 *       ## HashMicro Test Case - Character Analysis

 *       Checks how many **unique characters** from `input1` appear in `input2`.

 *       **Formula:** `(matched_unique_chars / total_length_input1) × 100%`

 *       ### Examples from the test:

 *       **Case 1 - Sensitive Case:**
 *       - Input1: `ABBCD` (5 chars, unique: A, B, C, D)
 *       - Input2: `Gallant Duck`
 *       - Only `D` matches (sensitive = exact case match)
 *       - Result: **1/5 = 20%**

 *       **Case 2 - Non-Sensitive Case:**
 *       - Input1: `ABBCD` (5 chars, unique: A, B, C, D)
 *       - Input2: `Gallant Duck`
 *       - `A`(a), `C`(c), `D`(D) match (case insensitive)
 *       - `B`(b) does NOT exist in "Gallant Duck"
 *       - Result: **3/5 = 60%**
 *     security:
 *       - ApiToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalysisRequest'
 *           examples:
 *             Sensitive Case (SOAL - Expected 20%):
 *               summary: Soal Case 1 - Sensitive
 *               value:
 *                 input1: "ABBCD"
 *                 input2: "Gallant Duck"
 *                 case_type: "sensitive"
 *             Insensitive Case (SOAL - Expected 60%):
 *               summary: Soal Case 2 - Non-Sensitive
 *               value:
 *                 input1: "ABBCD"
 *                 input2: "Gallant Duck"
 *                 case_type: "insensitive"
 *             All Match Sensitive:
 *               summary: All unique chars match
 *               value:
 *                 input1: "HELLO"
 *                 input2: "HELLO WORLD"
 *                 case_type: "sensitive"
 *             No Match:
 *               summary: No characters match
 *               value:
 *                 input1: "XYZ"
 *                 input2: "Hello World"
 *                 case_type: "sensitive"
 *             Case Diff Sensitive:
 *               summary: Same letters different case - sensitive = 0%
 *               value:
 *                 input1: "abc"
 *                 input2: "ABC"
 *                 case_type: "sensitive"
 *             Case Diff Insensitive:
 *               summary: Same letters different case - insensitive = 100%
 *               value:
 *                 input1: "abc"
 *                 input2: "ABC"
 *                 case_type: "insensitive"
 *             Special Characters:
 *               summary: Special characters and spaces
 *               value:
 *                 input1: "A@B C"
 *                 input2: "a@b c test"
 *                 case_type: "insensitive"
 *             Numbers:
 *               summary: Numbers as characters
 *               value:
 *                 input1: "123"
 *                 input2: "a1b2c3"
 *                 case_type: "sensitive"
 *             Duplicates:
 *               summary: Duplicate chars - AAA = 1 unique (A)
 *               value:
 *                 input1: "AAA"
 *                 input2: "Apple"
 *                 case_type: "sensitive"
 *     responses:
 *       200:
 *         description: Analysis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AnalysisResponse'
 *             examples:
 *               Sensitive Result:
 *                 value:
 *                   data:
 *                     id: 1
 *                     input1: "ABBCD"
 *                     input2: "Gallant Duck"
 *                     case_type: "sensitive"
 *                     result_percentage: 20
 *                     unique_chars: "A, B, C, D"
 *                     matched_chars: "D"
 *               Insensitive Result:
 *                 value:
 *                   data:
 *                     id: 2
 *                     input1: "ABBCD"
 *                     input2: "Gallant Duck"
 *                     case_type: "insensitive"
 *                     result_percentage: 60
 *                     unique_chars: "A, B, C, D"
 *                     matched_chars: "A, C, D"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Empty Input:
 *                 value:
 *                   errors: "input1: String must contain at least 1 character(s)"
 *               Invalid Type:
 *                 value:
 *                   errors: "case_type: Case type must be 'sensitive' or 'insensitive'"
 *       401:
 *         description: Unauthorized
 */
api.post("/analysis", (req, res, next) => {
  try {
    Validation.validate(AnalysisSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, analysisController.analyze);

/**
 * @openapi
 * /analysis/history:
 *   get:
 *     tags: [Analysis]
 *     summary: Get analysis history
 *     description: Returns all previous analysis results for the current user, newest first.
 *     security:
 *       - ApiToken: []
 *     responses:
 *       200:
 *         description: Analysis history list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnalysisResponse'
 *       401:
 *         description: Unauthorized
 */
api.get("/analysis/history", analysisController.getHistory);

export default api;
