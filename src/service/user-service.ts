import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ResponseError } from "../error/response-error";
import { UserRepository } from "../repository/user-repository";
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserModel,
} from "../model/user-model";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    const model = new UserModel(request.username, request.password, request.name);
    model.validate();

    const existingUser = await this.userRepository.findByUsername(request.username);
    if (existingUser) {
      throw new ResponseError(400, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const user = await this.userRepository.create({
      username: request.username,
      password: hashedPassword,
      name: request.name,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse & { token: string }> {
    const user = await this.userRepository.findByUsername(request.username);
    if (!user) {
      throw new ResponseError(401, "Invalid username or password");
    }

    const isValidPassword = await bcrypt.compare(request.password, user.password);
    if (!isValidPassword) {
      throw new ResponseError(401, "Invalid username or password");
    }

    const token = uuidv4();
    await this.userRepository.update(user.id, { token });

    return {
      username: user.username,
      name: user.name,
      token,
    };
  }

  async getUser(username: string): Promise<UserResponse> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    return {
      username: user.username,
      name: user.name,
    };
  }

  async updateUser(username: string, request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const updateData: Record<string, unknown> = {};

    // Nested if for validation
    if (request.name) {
      if (request.name.trim().length === 0) {
        throw new ResponseError(400, "Name cannot be empty");
      }
      updateData.name = request.name;
    }

    if (request.password) {
      if (request.password.length < 6) {
        throw new ResponseError(400, "Password must be at least 6 characters");
      }
      updateData.password = await bcrypt.hash(request.password, 10);
    }

    const updatedUser = await this.userRepository.update(user.id, updateData);

    return {
      username: updatedUser.username,
      name: updatedUser.name,
    };
  }

  async logout(username: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    await this.userRepository.update(user.id, { token: null });
    return "OK";
  }
}
