import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../service/employee-service";
import { SalaryService } from "../service/salary-service";
import { CreateEmployeeRequest, UpdateEmployeeRequest, SearchEmployeeRequest } from "../model/employee-model";
import { SalaryRequest } from "../model/analysis-model";

export class EmployeeController {
  private employeeService: EmployeeService;
  private salaryService: SalaryService;

  constructor() {
    this.employeeService = new EmployeeService();
    this.salaryService = new SalaryService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const request: CreateEmployeeRequest = req.body as CreateEmployeeRequest;
      const response = await this.employeeService.create(userId, request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const request: SearchEmployeeRequest = {
        name: req.query.name as string,
        department: req.query.department as string,
        position: req.query.position as string,
        email: req.query.email as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await this.employeeService.list(userId, request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const employeeId = Number(req.params.employeeId);
      const response = await this.employeeService.get(userId, employeeId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const employeeId = Number(req.params.employeeId);
      const request: UpdateEmployeeRequest = req.body as UpdateEmployeeRequest;
      const response = await this.employeeService.update(userId, employeeId, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const employeeId = Number(req.params.employeeId);
      await this.employeeService.remove(userId, employeeId);
      res.status(200).json({
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  };

  calculateSalary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const request: SalaryRequest = req.body as SalaryRequest;
      const response = await this.salaryService.calculateSalary(userId, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  getSalaryHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const employeeId = Number(req.params.employeeId);
      const response = await this.salaryService.getSalaryHistory(userId, employeeId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
