

# **API Management System**

## **Overview**
This project is an **API Management System** designed to charge users for API usage dynamically based on their subscription plans. The system tracks API usage, calculates costs, and provides admin analytics. It is built using **TypeScript**, **Node.js (Express.js)**, **PostgreSQL (TypeORM)**, and includes features such as **rate-limiting**, **access and refresh token authentication**, **swagger documentation**, and **async error handling**.

---

## **Features**
- **User Management**: User authentication and subscription to different plans.
- **Plan Management**: Various API plans with pricing and free request limits.
- **API Management**: Tracks API requests, calculates costs, and supports free APIs.
- **Admin Analytics**: Provides insights such as:
  - Total users
  - Total revenue
  - Total API requests
  - Monthly revenue
  - Plan-wise user details
- **Rate Limiting**: Prevents misuse of APIs.
- **Secure Authentication**:
  - Access tokens and refresh tokens stored securely.
  - Token refresh endpoint for seamless user experience.
- **Comprehensive Documentation**:
  - **Swagger**: For interactive API documentation.
  - **JSDoc**: For clear in-code documentation.
- **Entity Relationships**: A relational database structure with efficient queries.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with TypeORM for ORM
- **Authentication**: JWT-based access and refresh tokens
- **Documentation**: Swagger, JSDoc
- **Utilities**: Rate limiter, express-async-handler
- **Diagramming**: ER Diagrams, Data Flow Diagrams (DFD)

---

## **ER Diagram**
```plaintext
@startuml
!define ERDiagram

entity "Users" as Users {
    * user_id : UUID <<PK>>
    ---
    name : VARCHAR
    email : VARCHAR
    password : VARCHAR
    plan_id : UUID <<FK>>
    balance : DECIMAL
}

entity "Plans" as Plans {
    * plan_id : UUID <<PK>>
    ---
    plan_name : VARCHAR
    price_per_request : DECIMAL
    free_requests : INT
    description : TEXT
}

entity "APIs" as APIs {
    * api_id : UUID <<PK>>
    ---
    api_name : VARCHAR
    module : VARCHAR
    description : TEXT
    price_per_request : DECIMAL
    is_free : BOOLEAN
}

entity "API_Requests" as APIRequests {
    * request_id : UUID <<PK>>
    ---
    user_id : UUID <<FK>>
    api_id : UUID <<FK>>
    request_date : TIMESTAMP
    cost : DECIMAL
}

entity "Admin_Analytics" as AdminAnalytics {
    * analytics_id : UUID <<PK>>
    ---
    total_users : INT
    total_revenue : DECIMAL
    total_requests : INT
    monthly_revenue : DECIMAL
}

Users ||--o{ APIRequests : "makes"
APIRequests }o--|| APIs : "tracks"
Users ||--o| Plans : "subscribes"
Plans ||--o{ APIs : "includes"
@enduml
```

---

## **Data Flow Diagram**
### **Level 0**
```plaintext
User ---> [API Management System] ---> API
Admin ---> [Analytics Dashboard] ---> Insights
```

### **Level 1**
```plaintext
[User]
  |--> [Authentication System]
  |--> [API Subscription System]
  |--> [API Usage Tracker] ---> [Cost Calculator]
```

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/api-management-system.git
   cd api-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>
   JWT_SECRET=<your_jwt_secret>
   REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
   ```

4. Run migrations:
   ```bash
   npm run typeorm migration:run
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## **API Documentation**
- **Swagger**: Interactive API documentation available at `/api-docs`.

---

## **Folder Structure**
```
app/
  modules/
    user/
      user.controller.ts
      user.service.ts
      user.dto.ts
      user.entity.ts
      user.route.ts
    plan/
      plan.controller.ts
      plan.service.ts
      plan.dto.ts
      plan.entity.ts
      plan.route.ts
    api/
      api.controller.ts
      api.service.ts
      api.dto.ts
      api.entity.ts
      api.route.ts
    api-request/
      apiRequest.controller.ts
      apiRequest.service.ts
      apiRequest.dto.ts
      apiRequest.entity.ts
      apiRequest.route.ts
    admin-analytics/
      adminAnalytics.controller.ts
      adminAnalytics.service.ts
      adminAnalytics.dto.ts
      adminAnalytics.entity.ts
      adminAnalytics.route.ts
  database/
    data-source.ts
  middlewares/
    asyncHandler.ts
  app.ts
  server.ts

```

---

## **Core Endpoints**

### **Authentication**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh the access token

### **Users**
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### **Plans**
- `GET /plans` - Get all plans
- `POST /plans` - Create a new plan (admin only)

### **APIs**
- `GET /apis` - Get all APIs
- `POST /apis` - Register a new API (admin only)

### **API Requests**
- `POST /api-requests` - Create an API request
- `GET /api-requests` - Get all API requests for a user

### **Admin Analytics**
- `GET /admin/analytics` - Get admin dashboard analytics

---

## **Contributing**
Contributions are welcome! Please fork this repository and submit a pull request.

---

## **License**
This project is licensed under the **MIT License**.
