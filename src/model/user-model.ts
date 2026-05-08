import { BaseModel } from "./base-model";

export class UserModel extends BaseModel {
  public username: string;
  public password: string;
  public name: string;
  public token?: string;

  constructor(username: string, password: string, name: string, token?: string) {
    super();
    this.username = username;
    this.password = password;
    this.name = name;
    this.token = token;
  }

  validate(): void {
    this.validateRequired(this.username, "Username");
    this.validateMinLength(this.username, "Username", 3);
    this.validateRequired(this.password, "Password");
    this.validateMinLength(this.password, "Password", 6);
    this.validateRequired(this.name, "Name");
  }

  toResponse(): UserResponse {
    return {
      username: this.username,
      name: this.name,
    };
  }
}

export interface UserResponse {
  username: string;
  name: string;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
}
