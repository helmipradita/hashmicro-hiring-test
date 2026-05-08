import { ZodSchema, ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export class Validation {
  static validate<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (e) {
      if (e instanceof ZodError) {
        const errors = e.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("; ");
        throw new ResponseError(400, errors);
      }
      throw new ResponseError(400, "Validation failed");
    }
  }
}
