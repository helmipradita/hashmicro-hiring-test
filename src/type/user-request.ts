import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    id: number;
    username: string;
    name: string;
    token: string;
  };
}
