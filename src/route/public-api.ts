import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { Validation } from "../validation/validation";
import { RegisterUserSchema, LoginUserSchema } from "../validation/user-validation";

const publicApi = Router();
const userController = new UserController();

publicApi.post("/users/register", (req, res, next) => {
  try {
    Validation.validate(RegisterUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.register);

publicApi.post("/users/login", (req, res, next) => {
  try {
    Validation.validate(LoginUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.login);

export default publicApi;
