# HashMicro Technical Test - Node.js MVC Application

## Overview

Aplikasi web-based menggunakan **TypeScript + Express.js** dengan arsitektur MVC, menerapkan prinsip OOP dan Design Pattern.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js (MVC)
- **Database**: MySQL (Prisma ORM)
- **Validation**: Zod
- **Authentication**: Token-based (UUID)
- **Password**: bcrypt
- **Logging**: Winston

## Design Patterns yang Diterapkan

| Pattern | Implementasi |
|---------|-------------|
| **Inheritance** | `BaseModel` → `UserModel`, `EmployeeModel`, `AnalysisModel` |
| **Repository Pattern** | `BaseRepository<T>` → `UserRepository`, `EmployeeRepository`, dll |
| **Strategy Pattern** | `CaseStrategy` interface → `SensitiveCaseStrategy`, `InsensitiveCaseStrategy` |
| **Factory Pattern** | `StrategyFactory` untuk create strategy berdasarkan case type |
| **Singleton** | `Database` class untuk PrismaClient instance |

## Requirements yang Terpenuhi

### a. Nested Loop
- **Character Analysis**: Nested loop untuk mencari karakter unik dan membandingkan antara input
- **Salary Calculation**: Nested loop untuk tax bracket dan bonus calculation
- **Unique Character**: Nested loop untuk deduplikasi karakter

### b. Nested If
- **Employee Validation**: Nested if untuk validasi department dan salary range per position
- **Salary Calculation**: Nested if untuk bracket validation dan deduction cap
- **User Update**: Nested if untuk validasi field yang di-update

### c. Mathematics
- **Salary Calculator**: Progressive tax calculation, bonus calculation, deduction, net salary
- **Character Percentage**: Kalkulasi persentase kecocokan karakter

### d. CRUD
- **Employee Management**: Create, Read, Update, Delete employees
- **User Management**: Register, Login, Update profile, Logout
- **Salary Records**: Create dan Read salary calculation history
- **Analysis Results**: Create dan Read analysis history

### e. Character Analysis (String Matching)
- Sensitive case dan non-sensitive case comparison
- Menghitung persentase karakter unik dari input1 yang muncul di input2

## Prerequisites

- Node.js >= 18
- MySQL >= 5.7
- npm atau yarn

## Quick Start

```bash
# 1. Clone repository / masuk ke folder
cd hashmicro-hiring-test

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Setup database (pastikan MySQL running dan sesuaikan .env)
# Default: mysql://root:@localhost:3306/hashmicro_hiring_test
npx prisma migrate dev

# 5. Run development server
npm run dev

# 6. Build untuk production
npm run build
npm start
```

## Environment Variables

File `.env` di root directory:

```
DATABASE_URL="mysql://root:@localhost:3306/hashmicro_hiring_test"
PORT=3000
```

## Login Credentials

```
Username: admin
Password: admin123
```

Atau register user baru via `POST /api/users/register`.

## API Endpoints

### Public (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register user baru |
| POST | `/api/users/login` | Login dan get token |

### Protected (Auth Required - Header: `X-API-TOKEN`)

#### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/current` | Get current user |
| PATCH | `/api/users/current` | Update current user |
| DELETE | `/api/users/logout` | Logout |

#### Employee (CRUD)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | List employees (with search & pagination) |
| GET | `/api/employees/:id` | Get employee by ID |
| PATCH | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

#### Salary (Mathematics)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/salaries/calculate` | Calculate salary |
| GET | `/api/salaries/employee/:id` | Get salary history |

#### Character Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis` | Analyze character matching |
| GET | `/api/analysis/history` | Get analysis history |

## Test Cases dari Soal

### Case 1: Sensitive Case
```bash
curl -X POST http://localhost:3000/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"sensitive"}'
```
**Expected**: 20% (hanya karakter 'D' yang match dari "ABBCD")

### Case 2: Non-Sensitive Case
```bash
curl -X POST http://localhost:3000/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"insensitive"}'
```
**Expected**: 60% (karakter 'A', 'B', 'D' match → 3/5 = 60%)

## Complete Test Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","name":"Administrator"}'

# 2. Login (simpan token dari response)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Create Employee
curl -X POST http://localhost:3000/api/employees \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","phone":"081234567890","salary":15000000,"department":"Engineering","position":"Senior"}'

# 4. List Employees
curl http://localhost:3000/api/employees -H "X-API-TOKEN: <token>"

# 5. Calculate Salary
curl -X POST http://localhost:3000/api/salaries/calculate \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":1,"period":"2024-01"}'

# 6. Character Analysis (Sensitive)
curl -X POST http://localhost:3000/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"sensitive"}'

# 7. Character Analysis (Non-Sensitive)
curl -X POST http://localhost:3000/api/analysis \
  -H "X-API-TOKEN: <token>" \
  -H "Content-Type: application/json" \
  -d '{"input1":"ABBCD","input2":"Gallant Duck","case_type":"insensitive"}'
```

## Project Structure

```
src/
├── application/          # App config (database, logging, web)
│   ├── database.ts       # Singleton PrismaClient
│   ├── logging.ts        # Winston logger
│   └── web.ts            # Express setup
├── controller/           # MVC Controllers
│   ├── user-controller.ts
│   ├── employee-controller.ts
│   └── analysis-controller.ts
├── error/
│   └── response-error.ts # Custom error class
├── middleware/
│   ├── auth-middleware.ts
│   └── error-middleware.ts
├── model/                # OOP Models with inheritance
│   ├── base-model.ts     # Abstract base class
│   ├── user-model.ts
│   ├── employee-model.ts
│   ├── analysis-model.ts
│   └── page.ts
├── repository/           # Repository Pattern
│   ├── base-repository.ts    # Generic abstract class
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
│   ├── case-strategy.ts      # Interface
│   ├── sensitive-case.ts
│   ├── insensitive-case.ts
│   └── strategy-factory.ts   # Factory Pattern
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
