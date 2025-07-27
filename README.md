- ✅ **Day 24: Serving Static Files & Documentation**
    
    ### 🎯 Objective:
    
    Prepare your backend to serve frontend files (if needed) and write good API documentation.
    
    ### 📚 Topics:
    
    - Serving static frontend from `public` folder
        
        Once you have a frontend application (e.g., built with React, Next.js, Vue, Angular), you'll need your Express backend to serve its compiled static assets.
        
        - **Serving from a `public` folder:** For simple static sites (plain HTML, CSS, JS) or if your frontend build process places everything into a `public` directory within your backend project.
            
            ```jsx
            // In app.js
            app.use(express.static('public')); // Serves files from the 'public' folder
            ```
            
    - Serving frontend build (from React/Next.js) with Express
        - **Serving a frontend build (from React/Next.js/Vue):**
        After running `npm run build` (or similar) in your frontend project, it generates an optimized build output (e.g., a `build/` folder for Create React App, or `.next/static` for Next.js). You can then point Express to serve this.JavaScript
            
            **Key Considerations:**
            
            - **Path:** The path to your frontend build folder (e.g., `../frontend/build` if your frontend is a sibling directory to your backend).
            - **Client-side Routing Fallback:** For Single Page Applications (SPAs) like React, if a user directly accesses a route like `/dashboard` (which doesn't exist as a physical file on the server), Express needs to serve the main `index.html` file, and the frontend router will then handle the path. This is crucial.
            
            ```jsx
            // In app.js
            import path from 'path';
            import { fileURLToPath } from 'url';
            
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            
            // Serve static files from the frontend build directory
            // Assuming your frontend build output is in '../frontend/build' relative to your backend root
            app.use(express.static(path.join(__dirname, '../frontend/build')));
            
            // For any route not handled by your API, serve the frontend's index.html
            // This is crucial for client-side routing in SPAs (React Router, Vue Router, etc.)
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
            });
            ```
            
            **Important:** This `app.get('*')` should be placed **after all your API routes** so that API calls are handled first.
            
    - Writing good API documentation (README or Swagger basic)
        
        Good API documentation is essential for:
        
        - **Usability:** Developers (including your future self) can quickly understand how to interact with your API.
        - **Maintainability:** Easier to update and extend the API.
        - **Consistency:** Encourages consistent API design.
        - **README.md:** For smaller projects or initial documentation, a detailed `README.md` in Markdown format is excellent. It's human-readable, version-controllable, and universally supported.
        - **Swagger/OpenAPI:** For larger, more complex APIs, OpenAPI (formerly Swagger Specification) is the industry standard. It's a machine-readable specification for REST APIs. Tools like Swagger UI can then generate interactive documentation directly from your OpenAPI specification. While powerful, setting up OpenAPI can be more involved.
    
    ### 🔁 Assignment:
    
    - Document your secure Task Manager API with route descriptions
        
        # Secure Task Manager API
        
        This API provides a robust and secure backend for a Task Manager application, allowing users to manage their tasks, authenticate securely, and handle user profiles.
        
        ## Table of Contents
        
        - [Features](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Technologies Used](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Getting Started](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Prerequisites](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Installation](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Environment Variables](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Running the Application](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [API Endpoints](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Authentication](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Users](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [Tasks](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
            - [File Uploads](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Authentication](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Error Handling](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Security Measures](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        - [Logging and Monitoring](https://www.notion.so/Node-js-2381f3efe2db80e0a79cfb2cc627cb40?pvs=21)
        
        ## Features
        
        - **User Authentication:** Secure registration, login, logout, password reset, and password updates.
        - **User Management:** CRUD operations for users (admin-only access for some).
        - **Task Management:** CRUD operations for tasks, associated with authenticated users.
        - **File Uploads:** Single and multiple image upload functionality.
        - **Robust Error Handling:** Consistent error responses for various scenarios (e.g., validation, not found, duplicates).
        - **Security Middleware:** CORS, Helmet, Rate Limiting, Data Sanitization (NoSQL injection, XSS).
        - **Centralized Logging:** Detailed API activity and error logging with Winston and Morgan.
        
        ## Technologies Used
        
        - **Node.js**
        - **Express.js:** Web framework
        - **MongoDB:** NoSQL database
        - **Mongoose:** ODM for MongoDB
        - **JWT (JSON Web Tokens):** For authentication
        - **Bcrypt:** For password hashing
        - **Multer:** For handling `multipart/form-data` (file uploads)
        - **Cors:** Cross-Origin Resource Sharing
        - **Helmet:** Sets security-related HTTP headers
        - **Express-Rate-Limit:** For rate limiting API requests
        - **Express-Mongo-Sanitize:** Prevents NoSQL query injection
        - **XSS-Clean:** Prevents Cross-Site Scripting (XSS)
        - **Morgan:** HTTP request logger middleware
        - **Winston:** Production-ready logging library
        - **`AppError` (Custom):** For handling operational errors
        
        ## Getting Started
        
        ### Prerequisites
        
        - Node.js (LTS version recommended)
        - MongoDB instance (local or cloud like MongoDB Atlas)
        
        ### Installation
        
        1. **Clone the repository:**
            
            ```bash
            git clone [<https://github.com/your-username/secure-task-manager-api.git>](<https://github.com/your-username/secure-task-manager-api.git>)
            cd secure-task-manager-api
            
            ```
            
        2. **Install dependencies:**
            
            ```bash
            npm install
            # or
            yarn install
            
            ```
            
        3. **Create `logs` directory:**
            
            ```bash
            mkdir logs
            mkdir uploads
            
            ```
            
        
        ### Environment Variables
        
        Create a `.env` file in the root of your project and add the following environment variables:
        
        ```
        NODE_ENV=development # or production
        PORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/taskmanagerdb # Replace with your MongoDB connection string
        JWT_SECRET=supersecretjwtkey # Change this to a strong, random string
        JWT_EXPIRES_IN=90d
        JWT_COOKIE_EXPIRES_IN=90
        FRONTEND_URL=http://localhost:3000 # Your frontend URL for CORS
        EMAIL_USERNAME=your_email@example.com # For password reset emails (e.g., SendGrid, Mailgun)
        EMAIL_PASSWORD=your_email_password
        EMAIL_HOST=smtp.example.com
        EMAIL_PORT=587 # or 465 for SSL
        ```
        
        ### Running the Application
        
        ```jsx
        # For development (with nodemon, if installed)
        npm run dev
        
        # For production
        npm start
        ```
        
        The API will run on the port specified in your `.env` file (default: 3000).
        
        ## API Endpoints
        
        All API endpoints are prefixed with `/api`.
        
        ### Authentication
        
        Base URL: `/api/auth`
        
        | Route | Method | Description | Auth Rules | Request Body Example | Success Status | Error Status |
        | --- | --- | --- | --- | --- | --- | --- |
        | `/register` | `POST` | Register a new user. | Public | `{ "username": "newUser", "email": "user@example.com", "password": "password123", "passwordConfirm": "password123" }` | `201 Created` | `400 Bad Request`, `409 Conflict` (duplicate email) |
        | `/login` | `POST` | Log in a user and get JWT token. | Public | `{ "email": "user@example.com", "password": "password123" }` | `200 OK` | `401 Unauthorized` |
        | `/logout` | `GET` | Log out the current user (clears cookie). | Requires Auth Token | - | `200 OK` | `401 Unauthorized` |
        | `/me` | `GET` | Get current authenticated user's profile. | Requires Auth Token | - | `200 OK` | `401 Unauthorized`, `404 Not Found` |
        | `/forgotPassword` | `POST` | Request password reset email. | Public | `{ "email": "user@example.com" }` | `200 OK` | `400 Bad Request`, `404 Not Found` |
        | `/resetPassword/:token` | `PATCH` | Reset password using reset token. | Public | `{ "password": "newStrongPassword", "passwordConfirm": "newStrongPassword" }` | `200 OK` | `400 Bad Request` (invalid token/passwords) |
        | `/updatePassword` | `PATCH` | Update authenticated user's password. | Requires Auth Token | `{ "currentPassword": "password123", "newPassword": "newStrongPassword", "newPasswordConfirm": "newStrongPassword" }` | `200 OK` | `401 Unauthorized`, `400 Bad Request` |
        
        ### Users
        
        Base URL: `/api/users`
        
        | Route | Method | Description | Auth Rules | Request Body Example | Success Status | Error Status |
        | --- | --- | --- | --- | --- | --- | --- |
        | `/` | `GET` | Get all users. | Admin Only | - | `200 OK` | `401 Unauthorized`, `403 Forbidden` |
        | `/:id` | `GET` | Get user by ID. | Admin Only (or user themselves if ID matches) | - | `200 OK` | `401`, `403`, `404 Not Found` |
        | `/:id` | `PATCH` | Update user by ID. | Admin Only (or user themselves if ID matches) | `{ "username": "UpdatedUser" }` | `200 OK` | `401`, `403`, `400 Bad Request`, `404 Not Found` |
        | `/:id` | `DELETE` | Delete user by ID. | Admin Only (or user themselves if ID matches) | - | `204 No Content` | `401`, `403`, `404 Not Found` |
        | `/updateMe` | `PATCH` | Update current authenticated user's profile. | Requires Auth Token | `{ "username": "MyNewUsername", "email": "new@example.com" }` | `200 OK` | `401 Unauthorized`, `400 Bad Request` |
        | `/deleteMe` | `DELETE` | Deactivate current authenticated user's account. | Requires Auth Token | - | `204 No Content` | `401 Unauthorized` |
        
        ### Tasks
        
        Base URL: `/api/tasks`
        
        | Route | Method | Description | Auth Rules | Request Body Example | Success Status | Error Status |
        | --- | --- | --- | --- | --- | --- | --- |
        | `/` | `GET` | Get all tasks (can be filtered, sorted, paginated). | Public (or Requires Auth Token if associated with user) | - (Query Params: `?title=hello&sort=-createdAt&page=1&limit=10`) | `200 OK` | `400 Bad Request` |
        | `/` | `POST` | Create a new task. | Requires Auth Token | `{ "title": "Buy groceries", "description": "Milk, bread, eggs", "dueDate": "2025-08-01", "completed": false }` | `201 Created` | `400 Bad Request`, `401 Unauthorized` |
        | `/:id` | `GET` | Get a single task by ID. | Public (or Requires Auth Token) | - | `200 OK` | `404 Not Found` |
        | `/:id` | `PUT` | Update a task by ID. | Requires Auth Token | `{ "title": "Buy milk", "completed": true }` | `200 OK` | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
        | `/:id` | `DELETE` | Delete a task by ID. | Requires Auth Token | - | `204 No Content` | `401 Unauthorized`, `404 Not Found` |
        
        ### File Uploads
        
        Base URL: `/api/upload`
        
        | Route | Method | Description | Auth Rules | Request Body Example | Success Status | Error Status |
        | --- | --- | --- | --- | --- | --- | --- |
        | `/` | `POST` | Upload a single image file. | Public | `multipart/form-data` with field `image` | `200 OK` | `400 Bad Request` |
        | `/multiple` | `POST` | Upload multiple image files. | Public | `multipart/form-data` with field `images` (array) | `200 OK` | `400 Bad Request` |
        | `/uploads/:filename.jpg` | `GET` | Serve uploaded image file directly. | Public | - | `200 OK` (Image) | `404 Not Found` |
        
        ---
        
        ## Authentication
        
        This API uses **JSON Web Tokens (JWT)** for authentication.
        
        1. **Registration/Login:** Upon successful registration or login, the API sends a JWT token back to the client, typically as an HTTP-only cookie.
        2. **Protection:** Routes marked "Requires Auth Token" expect a valid JWT in the `Authorization` header as a `Bearer` token (e.g., `Authorization: Bearer <your-jwt-token>`).
        3. **Cookie:** If `JWT_COOKIE_EXPIRES_IN` is set in `.env`, the token is also sent as an HTTP-only cookie, making it secure against XSS attacks.
        
        ## Error Handling
        
        The API uses a centralized error handling mechanism to provide consistent and informative error responses.
        
        - **Operational Errors (4xx):** Expected errors (e.g., invalid input, resource not found, unauthorized access). These return a `4xx` status code and a clear `message` to the client.JSON
            
            ```jsx
            {
                "success": false,
                "status": "fail",
                "message": "Invalid input data: Title is required."
            }
            ```
            
        - **Programming/Internal Errors (5xx):** Unexpected errors (e.g., database connection issues, server code bugs). In `development` mode, the full error details (including stack trace) are returned for debugging. In `production` mode, a generic "Something went wrong!" message is returned to the client to avoid leaking sensitive information.JSON
            
            ```jsx
            {
                "success": false,
                "status": "error",
                "message": "Something went wrong! Please try again later."
            }
            ```
            
        
        ## Security Measures
        
        The API is equipped with several security middlewares:
        
        - **CORS:** Configured to allow requests from specified origins (`FRONTEND_URL`).
        - **Helmet:** Sets various HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, etc.) to mitigate common web vulnerabilities.
        - **Express-Rate-Limit:** Limits the number of requests per IP address to prevent brute-force attacks and abuse (e.g., 100 requests per 15 minutes for all `/api/` routes).
        - **Express-Mongo-Sanitize:** Cleans `req.body`, `req.query`, and `req.params` from `$` and `.` characters to prevent NoSQL query injection.
        - **XSS-Clean:** Sanitizes user input to prevent Cross-Site Scripting (XSS) attacks.
        
        ## Logging and Monitoring
        
        - **Morgan:** Used for HTTP request logging. In development, it logs to the console (`dev` format). In production, it can be configured to log to a file.
        - **Winston:** A robust, production-ready logging library.
            - Logs application events and errors with different severity levels (`debug`, `info`, `error`).
            - Logs errors to `logs/error.log` and all combined logs to `logs/combined.log` in JSON format.
            - Automatically includes timestamps and stack traces for errors.
            - Captures uncaught exceptions and unhandled promise rejections for critical error monitoring.