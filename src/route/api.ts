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

// User routes
api.get("/users/current", userController.get);
api.patch("/users/current", (req, res, next) => {
  try {
    Validation.validate(UpdateUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.update);
api.delete("/users/logout", userController.logout);

// Employee routes (CRUD)
api.post("/employees", (req, res, next) => {
  try {
    Validation.validate(CreateEmployeeSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.create);

api.get("/employees", employeeController.list);
api.get("/employees/:employeeId", employeeController.get);

api.patch("/employees/:employeeId", (req, res, next) => {
  try {
    Validation.validate(UpdateEmployeeSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.update);

api.delete("/employees/:employeeId", employeeController.remove);

// Salary routes (Mathematics)
api.post("/salaries/calculate", (req, res, next) => {
  try {
    Validation.validate(SalarySchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, employeeController.calculateSalary);

api.get("/salaries/employee/:employeeId", employeeController.getSalaryHistory);

// Analysis routes (Character matching)
api.post("/analysis", (req, res, next) => {
  try {
    Validation.validate(AnalysisSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, analysisController.analyze);

api.get("/analysis/history", analysisController.getHistory);

export default api;
