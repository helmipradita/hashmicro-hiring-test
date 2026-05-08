import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { Validation } from "../validation/validation";
import { RegisterUserSchema, LoginUserSchema } from "../validation/user-validation";

const publicApi = Router();
const userController = new UserController();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: User registration and authentication
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Create a new user account. After registration, login to get an API token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             New User:
 *               value:
 *                 username: "admin"
 *                 password: "admin123"
 *                 name: "Administrator"
 *             Short Password:
 *               summary: Password too short - will fail
 *               value:
 *                 username: "testuser"
 *                 password: "123"
 *                 name: "Test"
 *             Missing Username:
 *               summary: Missing required field - will fail
 *               value:
 *                 password: "admin123"
 *                 name: "No Username"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *       400:
 *         description: Validation error or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Duplicate:
 *                 value:
 *                   errors: "Username already exists"
 *               Validation:
 *                 value:
 *                   errors: "username: String must contain at least 3 character(s)"
 *               Short Password:
 *                 value:
 *                   errors: "password: String must contain at least 6 character(s)"
 */
publicApi.post("/users/register", (req, res, next) => {
  try {
    Validation.validate(RegisterUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.register);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get API token
 *     description: Authenticate with username and password. Returns a token for use in protected endpoints via the `X-API-TOKEN` header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             Valid Login:
 *               value:
 *                 username: "admin"
 *                 password: "admin123"
 *             Wrong Password:
 *               summary: Wrong password - will fail
 *               value:
 *                 username: "admin"
 *                 password: "wrongpassword"
 *             Nonexistent User:
 *               summary: User doesn't exist - will fail
 *               value:
 *                 username: "ghost"
 *                 password: "nopassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               data:
 *                 username: "admin"
 *                 name: "Administrator"
 *               token: "b25c47c2-e93b-4eec-a22a-ed872f98b8ae"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               errors: "Invalid username or password"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               errors: "username: String must contain at least 1 character(s)"
 */
publicApi.post("/users/login", (req, res, next) => {
  try {
    Validation.validate(LoginUserSchema, req.body);
    next();
  } catch (e) {
    next(e);
  }
}, userController.login);

export default publicApi;
