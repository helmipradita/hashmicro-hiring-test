export abstract class BaseModel {
  abstract validate(): void;

  protected validateRequired(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`${fieldName} is required`);
    }
  }

  protected validateMinLength(value: string, fieldName: string, minLength: number): void {
    if (value.length < minLength) {
      throw new Error(`${fieldName} must be at least ${minLength} characters`);
    }
  }

  protected validatePositiveNumber(value: number, fieldName: string): void {
    if (value < 0) {
      throw new Error(`${fieldName} must be a positive number`);
    }
  }

  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }
}
