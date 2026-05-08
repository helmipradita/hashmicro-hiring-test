import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
    const target = err.meta?.target;
    const field = Array.isArray(target) ? target.join(", ") : String(target || "field");
    res.status(400).json({
      errors: `${field} already exists`,
    });
    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      errors: err.message,
    });
  } else {
    res.status(500).json({
      errors: err.message || "Internal Server Error",
    });
  }
};
