- ✅ **Day 17: Protecting Routes with Middleware**
    
    ### 🎯 Objective:
    
    Secure your API using JWT-based authentication middleware.
    
    ### 📚 Topics:
    
    - Create `authMiddleware` to check for JWT in headers
        
        An **authentication middleware** is a specific type of middleware that runs *before* your actual route handler. Its job is to:
        
        1. **Intercept** incoming requests.
        2. **Check** if the request contains a valid authentication token (our JWT).
        3. **Verify** the token's authenticity and expiration.
        4. If valid, **decode** the token and attach the user's information to the `req` object (e.g., `req.user`).
        5. If valid, **pass control** to the next middleware or the route handler using `next()`.
        6. If invalid or missing, **stop the request** and send an appropriate error response (e.g., `401 Unauthorized`, `403 Forbidden`).
        
        Think of it as a security guard at the entrance of a VIP section. They check your pass (the JWT). If it's valid, they let you in and might even tell the bouncer your name. If it's fake or missing, they stop you right there.
        
        ```jsx
        // middleware/authMiddleware.js (initial part of the protect function)
        const jwt = require('jsonwebtoken');
        const User = require('../models/user.model');
        const AppError = require('../utils/AppError');
        
        exports.protect = async (req, res, next) => {
            let token;
        
            // --- 1. Check for JWT in Headers ---
            // The Authorization header typically looks like: "Authorization: Bearer <token>"
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                // If the header exists and starts with 'Bearer', extract the token part
                token = req.headers.authorization.split(' ')[1]; // Splits "Bearer <token>" into ["Bearer", "<token>"] and takes the second element
                console.log('Token found in headers:', token); // For debugging
            }
        
            // ... (rest of the middleware logic)
        };
        ```
        
    - Decode token and attach user info to `req.user`
        
        ### How JWT Authentication Middleware Works (Step-by-Step)
        
        Here's the flow within the middleware:
        
        - **Request Arrives:** A client sends an HTTP request to a protected route.
        - **Check for `req.headers.authorization`:**
            - The standard way to send a JWT is in the `Authorization` header.
            - The format is typically `Bearer <token>`.
            - Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
        - **Extract the Token:**
            - The middleware extracts the entire `Authorization` header value.
            - It then splits the string to get just the token part (removing "Bearer ").
        - **Handle Missing Token:** If the `Authorization` header is missing or doesn't follow the "Bearer" scheme, it's an immediate `401 Unauthorized` error.
        - **Verify the Token:**
            - Uses `jsonwebtoken.verify(token, JWT_SECRET)` to verify the token's signature and check its expiration.
            - This is a crucial step. If the token is tampered with, expired, or signed with a different secret, `jwt.verify` will throw an error.
        - **Decode and Attach User Info:**
            - If verification is successful, `jwt.verify` returns the decoded payload (the `userId`, `username`, etc., that you put in the token).
            - The middleware then typically fetches the user from the database using the `userId` from the token. This is important because the token payload might be outdated (e.g., user's role changed).
            - The fetched user object (or just the `id` and `email`) is then attached to the `req` object, usually as `req.user`. This makes user data easily accessible in subsequent route handlers.
        - **Call `next()`:** If all checks pass, `next()` is called, allowing the request to proceed to the actual route handler.
        - **Error Handling:** If any step fails (missing token, invalid token, expired token, user not found in DB), the middleware stops the request and passes an `AppError` to the global error handler.
        
        ```jsx
        // middleware/authMiddleware.js (inside the protect function)
        
            // ... (token extraction and missing token handling)
        
            try {
                // --- Decode and Verify Token ---
                // This line verifies the token's signature and expiration.
                // If valid, 'decoded' will contain the payload we signed (e.g., { id: user._id, email: user.email, username: user.username })
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Token decoded:', decoded); // For debugging: shows the payload
        
                // --- Attach User Info to req.user ---
                // It's best practice to fetch the user from the database using the ID from the token.
                // This ensures the user still exists and their information (like roles) is up-to-date.
                const currentUser = await User.findById(decoded.id); // 'decoded.id' is the 'id' we put in the JWT payload during login
        
                if (!currentUser) {
                    // If for some reason the user ID in the token doesn't exist in the DB
                    return next(new AppError('The user belonging to this token no longer exists.', 401));
                }
        
                // Attach the entire user object (without password due to select: false in model) to the request
                req.user = currentUser;
                console.log('User attached to req.user:', req.user.username); // For debugging
        
                next(); // IMPORTANT: Call next() to pass control to the next middleware or the route handler
        
            } catch (error) {
                // ... (error handling for invalid/expired tokens)
                next(error);
            }
        };
        ```
        
    - Handle missing or invalid tokens
        
        Your middleware needs to explicitly handle these common error scenarios:
        
        - **No Token Provided:** If `req.headers.authorization` is missing or malformed.
            - **Status Code:** `401 Unauthorized`
            - **Message:** "No token provided" or "Not authorized to access this route"
        - **Invalid Token (Signature Mismatch or Malformed):** `jsonwebtoken.verify` will throw a `JsonWebTokenError`.
            - **Status Code:** `401 Unauthorized`
            - **Message:** "Invalid token. Please log in again."
        - **Expired Token:** `jsonwebtoken.verify` will throw a `TokenExpiredError`.
            - **Status Code:** `401 Unauthorized`
            - **Message:** "Token has expired. Please log in again."
        - **User Not Found:** If the `userId` in the token doesn't correspond to an actual user in your database (e.g., user was deleted after token was issued).
            - **Status Code:** `401 Unauthorized` or `403 Forbidden` (depending on policy)
            - **Message:** "The user belonging to this token no longer exists."
        
        ```jsx
        // middleware/authMiddleware.js (inside the protect function)
        
            // ... (token extraction logic)
        
            // --- Handle Missing Token ---
            if (!token) {
                // If no token was found or it wasn't in the expected "Bearer" format
                return next(new AppError('You are not logged in! Please log in to get access.', 401));
                // We use 'return next()' to immediately stop execution of this middleware
                // and pass control to the global error handler.
            }
        
            try {
                // ... (token verification and user attachment logic)
            } catch (error) {
                // --- Handle Invalid or Expired Tokens ---
                // The global error handler in app.js will specifically check for these error types
                // and send appropriate 401 responses.
                // We simply pass the error along using next(error).
                next(error);
            }
        ```
        
    - Use `req.headers.authorization` pattern: `Bearer <token>`
        
        This is the specific format we expect the token to be in.
        
        **Concept:** The `Bearer` scheme is the most common way to transmit JWTs. It indicates that the bearer of the token (the client) is authorized to access the resource.
        
        ```jsx
        // middleware/authMiddleware.js (inside the protect function)
        
            // ...
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                // This line specifically targets the "Bearer <token>" pattern.
                // req.headers.authorization will contain the full string like "Bearer eyJhbGciOiJIUzI1Ni..."
                token = req.headers.authorization.split(' ')[1];
                // After splitting by space, the array will be ["Bearer", "eyJhbGciOiJIUzI1Ni..."],
                // so [1] gives us the actual JWT string.
            }
            // ...
        ```
        
    
    ### 💻 Task:
    
    - Protect a route: `GET /dashboard` → Only accessible with valid token
    - Add middleware to real API (e.g., `/tasks`)