import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user-service";
import { RegisterUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user-model";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request: RegisterUserRequest = req.body as RegisterUserRequest;
      const response = await this.userService.register(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const response = await this.userService.login(request);
      res.status(200).json({
        data: {
          username: response.username,
          name: response.name,
        },
        token: response.token,
      });
    } catch (e) {
      next(e);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = (req as any).user.username;
      const response = await this.userService.getUser(username);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = (req as any).user.username;
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await this.userService.updateUser(username, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = (req as any).user.username;
      await this.userService.logout(username);
      res.status(200).json({
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  };
}
