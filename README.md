# HashMicro Technical Test - Node.js MVC Application

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-4.x-orange.svg" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-5.x-purple.svg" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-00758F.svg" alt="MySQL">
</p>

## Overview

Aplikasi web-based menggunakan **TypeScript + Express.js** dengan arsitektur MVC, menerapkan prinsip OOP dan Design Pattern. Aplikasi ini memenuhi semua requirements teknis yang dibutuhkan.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime & Language |
| Express.js | Web Framework (MVC) |
| Prisma ORM | Database ORM |
| MySQL 8.0 | Database |
| Zod | Validation |
| bcrypt | Password Hashing |
| Winston | Logging |
| Jest | Testing |

## Architecture

```mermaid
graph TB
    subgraph "Client"
        HTTP[HTTP Requests]
    end

    subgraph "Application Layer"
        WEB[Express Web Server]
        MID[Middleware]
        ROUTE[Routes]
    end

    subgraph "Controller Layer"
        UC[User Controller]
        EC[Employee Controller]
        SC[Salary Controller]
        AC[Analysis Controller]
    end

    subgraph "Service Layer"
        US[User Service]
        ES[Employee Service]
        SS[Salary Service]
        AS[Analysis Service]
    end

    subgraph "Repository Layer"
        UR[User Repository]
        ER[Employee Repository]
        SR[Salary Repository]
        AR[Analysis Repository]
    end

    subgraph "Database"
        DB[(MySQL)]
    end

    HTTP --> WEB
    WEB --> MID
    MID --> ROUTE
    ROUTE --> UC
    ROUTE --> EC
    ROUTE --> SC
    ROUTE --> AC
    UC --> US
    EC --> ES
    SC --> SS
    AC --> AS
    US --> UR
    ES --> ER
    SS --> SR
    AS --> AR
    UR --> DB
    ER --> DB
    SR --> DB
    AR --> DB
```

## Design Patterns

```mermaid
classDiagram
    class BaseModel {
        <<abstract>>
        +validate()
        +toJSON()
    }
    class UserModel {
        +username: string
        +password: string
        +name: string
        +validate()
    }
    class EmployeeModel {
        +first_name: string
        +last_name: string
        +email: string
        +salary: number
        +validate()
    }
    class AnalysisModel {
        +input1: string
        +input2: string
        +case_type: string
        +validate()
    }

    BaseModel <|-- UserModel
    BaseModel <|-- EmployeeModel
    BaseModel <|-- AnalysisModel
```

| Pattern | Implementation |
|---------|---------------|
| **Inheritance** | `BaseModel` → `UserModel`, `EmployeeModel`, `AnalysisModel` |
| **Repository** | `BaseRepository<T>` → `UserRepository`, `EmployeeRepository`, dll |
| **Strategy** | `CaseStrategy` → `SensitiveCaseStrategy`, `InsensitiveCaseStrategy` |
| **Factory** | `StrategyFactory` untuk create strategy berdasarkan case type |
| **Singleton** | `Database` class untuk PrismaClient instance |

## Requirements Implementation

### a. Nested Loop
- **Character Analysis**: Nested loop untuk mencari karakter unik dan membandingkan
- **Salary Calculation**: Nested loop untuk tax bracket dan bonus calculation
- **Unique Character**: Nested loop untuk deduplikasi karakter

### b. Nested If
- **Employee Validation**: Nested if untuk validasi department dan salary range
- **Salary Calculation**: Nested if untuk bracket validation dan deduction cap

### c. Mathematics
- **Salary Calculator**: Progressive tax, bonus calculation, deductions, net salary
- **Character Percentage**: Kalkulasi persentase kecocokan karakter

### d. CRUD Operations
- **Employee Management**: Create, Read, Update, Delete
- **User Management**: Register, Login, Update, Logout
- **Salary Records**: Create dan Read salary history
- **Analysis Results**: Create dan Read analysis history

### e. Character Analysis
- Sensitive case dan non-sensitive case comparison
- Menghitung persentase karakter unik dari input1 yang muncul di input2

## Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- Docker (optional, for containerized setup)

## Quick Start

```bash
# 1. Clone / masuk ke folder
cd hashmicro-hiring-test

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Generate Prisma client
npx prisma generate

# 5. Setup database
# Pastikan MySQL running
npx prisma migrate dev

# 6. Run development server
npm run dev

# 7. Build untuk production
npm run build
npm start
```

## Docker Setup

```bash
# Build dan run semua services (API + DB)
docker-compose up --build

# atau untuk development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Services:**
- API: `http://localhost:8081`
- MySQL: `localhost:3306`

## API Endpoints

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /api/users/register
    API->>DB: Create new user
    DB-->>API: User created
    API-->>Client: 201 Created

    Client->>API: POST /api/users/login
    API->>DB: Find user by username
    DB-->>API: User found
    API->>API: Verify password (bcrypt)
    API-->>Client: 200 OK + Token

    Client->>API: GET /api/employees (with Token)
    API->>API: Validate Token
    API->>DB: Fetch employees
    DB-->>API: Employee list
    API-->>Client: 200 OK
```

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register user baru |
| POST | `/api/users/login` | Login dan get token |

### Protected Endpoints (Auth Required)

#### Header: `X-API-TOKEN: <token>`

##### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/current` | Get current user |
| PATCH | `/api/users/current` | Update current user |
| DELETE | `/api/users/logout` | Logout |

##### Employee CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | List employees (search & pagination) |
| GET | `/api/employees/:id` | Get employee by ID |
| PATCH | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

##### Salary Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/salaries/calculate` | Calculate salary |
| GET | `/api/salaries/employee/:id` | Get salary history |

##### Character Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis` | Analyze character matching |
| GET | `/api/analysis/history` | Get analysis history |

## Test Cases

### Case 1: Sensitive Case
```bash
curl -X POST http://localhost:8081/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"sensitive"}'
```
**Expected**: 20% (hanya karakter 'D' yang match dari "ABBCD")

### Case 2: Non-Sensitive Case
```bash
curl -X POST http://localhost:8081/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"insensitive"}'
```
**Expected**: 60% (karakter 'A', 'B', 'D' match → 3/5 = 60%)

## Complete Test Flow

```bash
# 1. Register
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","name":"Admin"}'

# 2. Login
curl -X POST http://localhost:8081/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Create Employee
curl -X POST http://localhost:8081/api/employees \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","phone":"081234567890","salary":15000000,"department":"Engineering","position":"Senior"}'

# 4. List Employees
curl http://localhost:8081/api/employees -H "X-API-TOKEN: <token>"

# 5. Calculate Salary
curl -X POST http://localhost:8081/api/salaries/calculate \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":1,"period":"2024-01"}'

# 6. Character Analysis (Sensitive)
curl -X POST http://localhost:8081/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"sensitive"}'

# 7. Character Analysis (Insensitive)
curl -X POST http://localhost:8081/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"insensitive"}'
```

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

## Project Structure

```
src/
├── application/          # App config
│   ├── database.ts       # Singleton PrismaClient
│   ├── logging.ts        # Winston logger
│   ├── swagger.ts        # API Documentation
│   └── web.ts            # Express setup
├── controller/           # MVC Controllers
│   ├── user-controller.ts
│   ├── employee-controller.ts
│   ├── salary-controller.ts
│   └── analysis-controller.ts
├── error/
│   └── response-error.ts # Custom error class
├── middleware/
│   ├── auth-middleware.ts
│   └── error-middleware.ts
├── model/                # OOP Models
│   ├── base-model.ts     # Abstract base class
│   ├── user-model.ts
│   ├── employee-model.ts
│   ├── analysis-model.ts
│   └── page.ts
├── repository/           # Repository Pattern
│   ├── base-repository.ts
│   ├── user-repository.ts
│   ├── employee-repository.ts
│   ├── salary-repository.ts
│   └── analysis-repository.ts
├── service/              # Business logic
│   ├── user-service.ts
│   ├── employee-service.ts
│   ├── salary-service.ts
│   └── analysis-service.ts
├── strategy/             # Strategy Pattern
│   ├── case-strategy.ts
│   ├── sensitive-case.ts
│   ├── insensitive-case.ts
│   └── strategy-factory.ts
├── route/
│   ├── public-api.ts
│   └── api.ts
├── type/
│   └── user-request.ts
├── validation/           # Zod validation
│   ├── validation.ts
│   ├── user-validation.ts
│   ├── employee-validation.ts
│   └── analysis-validation.ts
└── main.ts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript |
| `npm start` | Start production server |
| `npm run test` | Run tests |
| `npx prisma migrate dev` | Run migrations |
| `npx prisma db push` | Push schema to DB |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open Prisma Studio |

## Environment Variables

```env
DATABASE_URL="mysql://root:root@localhost:3306/hashmicro_hiring_test"
PORT=8081
```

See `.env.example` for the complete template.