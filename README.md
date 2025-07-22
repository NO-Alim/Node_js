- ✅ **Day 20: CORS, Helmet, and Security Middleware**
    
    ### 🎯 Objective:
    
    Secure your API for deployment by adding basic protections.
    
    ### 📚 Topics:
    
    - What is CORS? Why it's needed?
        - **What is CORS?**
        CORS stands for **Cross-Origin Resource Sharing**. It's a mechanism that allows web browsers to permit web pages to make requests to a different domain than the one that served the web page.
        - **Why it's needed?**
        By default, web browsers enforce a security feature called the **Same-Origin Policy (SOP)**. This policy prevents a web page loaded from one origin (domain, protocol, port) from interacting with a resource from another origin. For example, a frontend application running on `http://localhost:3000` (development server) cannot directly make an AJAX request to your backend API running on `http://localhost:5000` (or `https://api.yourdomain.com` in production). SOP would block this to prevent malicious scripts from one site stealing data from another.
        CORS provides a standardized way for the server to explicitly tell the browser that it's permissible for a given origin to access its resources.
    - Allowing cross-origin requests using `cors` package
        - **Allowing cross-origin requests using `cors` package:**
        The `cors` npm package is the most popular way to enable CORS in an Express.js application.
    - Using `helmet` for setting secure HTTP headers
        - **What is Helmet?**
        Helmet is a collection of 14 smaller middleware functions that set various HTTP headers to help protect your Express apps from well-known web vulnerabilities. It's not a silver bullet, but it provides a good first line of defense.
        - **Why it's needed?**
        Many common web attacks can be mitigated by properly setting HTTP response headers. For example:
            - **X-Content-Type-Options: `nosniff`**: Prevents browsers from "sniffing" MIME types, which can prevent XSS attacks.
            - **X-Frame-Options: `DENY`**: Prevents clickjacking by stopping your site from being embedded in a `<frame>`, `<iframe>`, `<embed>`, or `<object>`.
            - **Strict-Transport-Security (HSTS)**: Forces browsers to use HTTPS for your domain, protecting against downgrade attacks and cookie hijacking.
            - **X-XSS-Protection: `0`**: (Modern browsers typically handle XSS protection better internally, but it's part of Helmet).
            - **Content-Security-Policy (CSP)**: Helps prevent XSS and other injection attacks by controlling which resources the user agent is allowed to load. (Helmet's default CSP is very restrictive, often requiring customization).
    - Rate limiting with `express-rate-limit`
        - **What is Rate Limiting?**
        Rate limiting is a technique to control the amount of incoming or outgoing traffic on a network. In the context of an API, it limits the number of requests a user (identified by IP address or user ID) can make to your API within a specified time window.
        - **Why it's needed?**
            - **Prevent Brute-Force Attacks:** Especially on login endpoints.
            - **Prevent Denial-of-Service (DoS) Attacks:** By limiting the number of requests a single client can make, you can mitigate simple DoS attacks.
            - **Prevent API Abuse:** Stop bots from scraping your data too quickly or users from over-consuming your resources.
            - **Fair Usage:** Ensure that one user doesn't hog all your server resources, providing a better experience for everyone.
    - Sanitizing input with `express-mongo-sanitize`, `xss-clean` (optional)
        - **Why Input Sanitization?**
        User input is one of the biggest attack vectors. Malicious input can lead to:
            - **NoSQL Injection:** If an attacker sends MongoDB query operators (`$`, `.`) in input fields, they might manipulate your queries to bypass authentication or access unauthorized data.
            - **Cross-Site Scripting (XSS):** If an attacker injects malicious client-side scripts (e.g., `<script>alert('You are hacked!')</script>`) into your database, and your application later renders that data to other users, their browsers will execute the script.
        - **`express-mongo-sanitize`:**
            - **Purpose:** Prevents MongoDB Operator Injection. It scans `req.body`, `req.query`, and `req.params` and removes any `$` or `.` characters from keys, which are special MongoDB operators.
            - **How it works:** When a field named, say, `username.$gt` is sent, it will convert it to `usernamegt` (or similar, depending on configuration), preventing MongoDB from interpreting it as an operator.
        - **`xss-clean`:**
            - **Purpose:** Prevents Cross-Site Scripting (XSS) attacks. It sanitizes user input coming from `req.body`, `req.query`, and `req.params` by encoding or removing potentially malicious HTML characters (like `<script>`, `onerror`, etc.).
            - **How it works:** It typically converts HTML entities to their HTML entity equivalents (e.g., `<` becomes `&lt;`), so they are rendered as text rather than executed as code.
    
    ### 💻 Task:
    
    - Add all security middleware to your Express app
        
        ```jsx
        //sanitizeRequest.js
        const sanitizeRequest = (req, res, next) => {
            const sanitize = (obj) => {
                for (let key in obj) {
                  if (/[$.]/.test(key)) {
                    const cleanKey = key.replace(/[$.]/g, '');
                    obj[cleanKey] = obj[key];
                    delete obj[key];
                  }
                  if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                  }
                }
              };
            
              if (req.body) sanitize(req.body);
              if (req.query) sanitize(req.query);
              if (req.params) sanitize(req.params);
            
              next();
        }
        
        export default sanitizeRequest;
        ```
        
        ```jsx
        //app.js
        import express from "express";
        import cors from 'cors';
        import helmet from 'helmet';
        import rateLimit from 'express-rate-limit';
        import authRoute from "./routes/auth.routes.js";
        import taskRoute from "./routes/task.routes.js";
        import errorHandler from "./middleware/errorHandler.js";
        import notFound from "./middleware/not-found.js";
        import sanitizeRequest from "./middleware/sanitizeRequest.js";
        
        const app = express();
        // helmet
        app.use(helmet());
        
        //cors opitons
        const corsOptions = {
            origin: ['http://localhost:3000', 'https://xyz.com'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204,
        }
        
        // cors
        app.use(cors(corsOptions));
        
        // Limit body size to prevent large payloads
        // Prevent denial-of-service (DoS) attacks
        // Avoid memory overconsumption by large request bodies
        app.use(express.json({limit: '10kb'}));
        app.use(express.urlencoded({ extended: true, limit: '10kb' }));
        
        // Insted of mongoSanitize(express-mongo-sanitize)
        app.use(sanitizeRequest);
        
        // rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Max 100 requests per IP per windowMs
            message: 'Too many requests from this IP, please try again after 15 minutes.',
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        });
        
        // apply limit to task route
        app.use('/api/task', limiter);
        
        app.use('/api/auth', authRoute);
        app.use('/api/task',taskRoute)
        
        app.use(notFound)
        
        app.use(errorHandler);
        
        export default app;
        ```
        
    - Setup CORS for frontend-backend communication
        
        
        ```jsx
        const corsOptions = {
            origin: ['http://localhost:3000', 'https://xyz.com'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204,
        }
        
        // cors
        app.use(cors(corsOptions));
        ```
        
    
    ### 🔁 Assignment:
    
    - Create a checklist of all security middlewares and where they’re used
        
        To solidify your understanding, create a simple checklist for all the security middlewares you've implemented. This will be very helpful for quick reference or when onboarding new team members.
        
        **Your Checklist should look something like this:**
        
        ### Security Middleware Checklist
        
        1. **`helmet`**
            - **Function:** Sets various HTTP response headers to enhance security (e.g., `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `X-XSS-Protection`).
            - **Usage Location:** Applied globally via `app.use(helmet());` early in `app.js`.
        2. **`cors`**
            - **Function:** Enables Cross-Origin Resource Sharing, allowing specified frontend domains to make requests to your API, bypassing the Same-Origin Policy.
            - **Usage Location:** Applied globally via `app.use(cors(corsOptions));` early in `app.js`, after Helmet. Configuration (`corsOptions`) specifies allowed origins, methods, etc.
        3. **`mongo-sanitize`**
            - **Function:** Prevents NoSQL Query Injection by removing `$` and `.` from user-supplied input in `req.body`, `req.query`, and `req.params`.
            - **Usage Location:** Applied globally via `app.use(mongoSanitize());` in `app.js`, *after* body parsers (`express.json()`, `express.urlencoded()`) but *before* route handlers.
        4. **`express-rate-limit`**
            - **Function:** Limits repeated requests to public APIs or endpoints to prevent brute-force attacks, DDoS attacks, and general API abuse.
            - **Usage Location:** Applied via `app.use('/api/', limiter);` in `app.js`, typically after other global middlewares but before specific route definitions. Can also be applied to individual routes (e.g., `app.post('/api/auth/login', loginLimiter, authController.login)`).
        
        **Self-Correction/Improvements:**
        
        - Ensure your `dotenv.config()` call is at the very top of `app.js` to load environment variables.
        - The `limit: '10kb'` in `express.json()` and `express.urlencoded()` is a good practice to prevent large payload attacks.
        - Remember to adjust `corsOptions.origin` for your production frontend domain(s)!
        - The `standardHeaders: true` and `legacyHeaders: false` for `express-rate-limit` are good modern practices.