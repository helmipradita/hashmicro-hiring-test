import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HashMicro Technical Test API",
      version: "1.0.0",
      description:
        "Node.js MVC Application with OOP & Design Patterns\n\n" +
        "**Tech Stack**: TypeScript, Express.js, Prisma ORM, MySQL\n\n" +
        "**Design Patterns**: Inheritance, Repository, Strategy, Factory, Singleton\n\n" +
        "**Features**: CRUD Employee, Salary Calculator (Mathematics), Character Analysis (String Matching)\n\n" +
        "---\n\n" +
        "**Login Credentials:**\n" +
        "- Username: `admin`\n" +
        "- Password: `admin123`\n\n" +
        "Register first via `POST /api/users/register`, then login to get token.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        ApiToken: {
          type: "apiKey",
          in: "header",
          name: "X-API-TOKEN",
          description: "Token obtained from login endpoint",
        },
      },
      schemas: {
        UserResponse: {
          type: "object",
          properties: {
            username: { type: "string", example: "admin" },
            name: { type: "string", example: "Administrator" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                username: { type: "string", example: "admin" },
                name: { type: "string", example: "Administrator" },
              },
            },
            token: { type: "string", example: "b25c47c2-e93b-4eec-a22a-ed872f98b8ae" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "password", "name"],
          properties: {
            username: { type: "string", minLength: 3, maxLength: 50, example: "admin" },
            password: { type: "string", minLength: 6, maxLength: 100, example: "admin123" },
            name: { type: "string", minLength: 1, maxLength: 100, example: "Administrator" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "admin" },
            password: { type: "string", example: "admin123" },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "New Name" },
            password: { type: "string", minLength: 6, example: "newpassword123" },
          },
        },
        EmployeeResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            first_name: { type: "string", example: "John" },
            last_name: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@example.com" },
            phone: { type: "string", example: "081234567890" },
            salary: { type: "number", example: 15000000 },
            department: { type: "string", example: "Engineering" },
            position: { type: "string", example: "Senior" },
          },
        },
        CreateEmployeeRequest: {
          type: "object",
          required: ["first_name", "last_name", "email", "phone", "salary", "department", "position"],
          properties: {
            first_name: { type: "string", example: "John" },
            last_name: { type: "string", example: "Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "081234567890" },
            salary: { type: "number", minimum: 0, example: 15000000, description: "Salary in IDR" },
            department: {
              type: "string",
              enum: ["Engineering", "Marketing", "Finance", "HR", "Operations", "Sales"],
              example: "Engineering",
            },
            position: {
              type: "string",
              enum: ["Intern", "Junior", "Middle", "Senior", "Lead", "Manager"],
              example: "Senior",
            },
          },
        },
        UpdateEmployeeRequest: {
          type: "object",
          properties: {
            first_name: { type: "string", example: "Johnny" },
            last_name: { type: "string", example: "Updated" },
            email: { type: "string", format: "email", example: "johnny@example.com" },
            phone: { type: "string", example: "081234567891" },
            salary: { type: "number", minimum: 0, example: 20000000 },
            department: { type: "string", example: "Engineering" },
            position: { type: "string", example: "Senior" },
          },
        },
        EmployeeListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/EmployeeResponse" },
            },
            paging: {
              type: "object",
              properties: {
                current_page: { type: "integer", example: 1 },
                total_page: { type: "integer", example: 1 },
                size: { type: "integer", example: 10 },
                total_data: { type: "integer", example: 5 },
              },
            },
          },
        },
        SalaryRequest: {
          type: "object",
          required: ["employee_id", "period"],
          properties: {
            employee_id: { type: "integer", example: 1 },
            period: { type: "string", example: "2024-01", description: "Format: YYYY-MM" },
          },
        },
        SalaryResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            employee_id: { type: "integer", example: 1 },
            base_salary: { type: "number", example: 15000000 },
            bonus: { type: "number", example: 2700000 },
            tax: { type: "number", example: 1833333 },
            deductions: { type: "number", example: 600000 },
            net_salary: { type: "number", example: 15266667 },
            period: { type: "string", example: "2024-01" },
          },
        },
        AnalysisRequest: {
          type: "object",
          required: ["input1", "input2", "case_type"],
          properties: {
            input1: { type: "string", maxLength: 500, example: "ABBCD", description: "First input string" },
            input2: {
              type: "string",
              maxLength: 500,
              example: "Gallant Duck",
              description: "Second input string",
            },
            case_type: {
              type: "string",
              enum: ["sensitive", "insensitive"],
              example: "sensitive",
              description: "Case sensitivity mode",
            },
          },
        },
        AnalysisResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            input1: { type: "string", example: "ABBCD" },
            input2: { type: "string", example: "Gallant Duck" },
            case_type: { type: "string", example: "sensitive" },
            result_percentage: { type: "number", example: 20, description: "Percentage of matched characters" },
            unique_chars: { type: "string", example: "A, B, C, D" },
            matched_chars: { type: "string", example: "D" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            errors: { type: "string", example: "Error message here" },
          },
        },
      },
    },
  },
  apis: ["./src/route/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
