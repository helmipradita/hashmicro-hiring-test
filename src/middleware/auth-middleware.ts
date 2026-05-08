import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repository/user-repository";
import { ResponseError } from "../error/response-error";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.get("X-API-TOKEN");
    if (!token) {
      throw new ResponseError(401, "Unauthorized: Token is required");
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findByToken(token);
    if (!user) {
      throw new ResponseError(401, "Unauthorized: Invalid token");
    }

    (req as any).user = user;
    next();
  } catch (e) {
    next(e);
  }
};
