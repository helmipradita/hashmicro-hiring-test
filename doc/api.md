# API Documentation

## Authentication

Semua endpoint yang memerlukan auth harus menyertakan header:
```
X-API-TOKEN: <token_dari_login>
```

## 1. Auth Endpoints

### Register
```
POST /api/users/register
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "name": "Administrator"
}

Response 201:
{
  "data": {
    "username": "admin",
    "name": "Administrator"
  }
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response 200:
{
  "data": {
    "username": "admin",
    "name": "Administrator"
  },
  "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## 2. Employee CRUD

### Create Employee
```
POST /api/employees
X-API-TOKEN: <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "salary": 15000000,
  "department": "Engineering",
  "position": "Senior"
}
```

### List Employees (with search & pagination)
```
GET /api/employees?name=John&department=Engineering&page=1&size=10
X-API-TOKEN: <token>
```

### Update Employee
```
PATCH /api/employees/1
X-API-TOKEN: <token>
Content-Type: application/json

{
  "salary": 20000000
}
```

### Delete Employee
```
DELETE /api/employees/1
X-API-TOKEN: <token>
```

## 3. Salary Calculator

### Calculate Salary
```
POST /api/salaries/calculate
X-API-TOKEN: <token>
Content-Type: application/json

{
  "employee_id": 1,
  "period": "2024-01"
}

Response 200:
{
  "data": {
    "id": 1,
    "employee_id": 1,
    "base_salary": 15000000,
    "bonus": 2700000,
    "tax": 937500,
    "deductions": 600000,
    "net_salary": 17162500,
    "period": "2024-01"
  }
}
```

## 4. Character Analysis

### Analyze (Sensitive Case) - Expected: 20%
```
POST /api/analysis
X-API-TOKEN: <token>
Content-Type: application/json

{
  "input1": "ABBCD",
  "input2": "Gallant Duck",
  "case_type": "sensitive"
}

Response 200:
{
  "data": {
    "id": 1,
    "input1": "ABBCD",
    "input2": "Gallant Duck",
    "case_type": "sensitive",
    "result_percentage": 20,
    "unique_chars": "A, B, C, D",
    "matched_chars": "D"
  }
}
```

### Analyze (Non-Sensitive Case) - Expected: 60%
```
POST /api/analysis
X-API-TOKEN: <token>
Content-Type: application/json

{
  "input1": "ABBCD",
  "input2": "Gallant Duck",
  "case_type": "insensitive"
}

Response 200:
{
  "data": {
    "id": 2,
    "input1": "ABBCD",
    "input2": "Gallant Duck",
    "case_type": "insensitive",
    "result_percentage": 60,
    "unique_chars": "A, B, C, D",
    "matched_chars": "A, B, D"
  }
}
```

## 5. Analysis History
```
GET /api/analysis/history
X-API-TOKEN: <token>
```
