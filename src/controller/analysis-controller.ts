import { Request, Response, NextFunction } from "express";
import { AnalysisService } from "../service/analysis-service";
import { AnalysisRequest } from "../model/analysis-model";

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const request: AnalysisRequest = req.body as AnalysisRequest;
      const response = await this.analysisService.analyze(userId, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const response = await this.analysisService.getHistory(userId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
