import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoute from "./routes/auth.routes.js";
import taskRoute from "./routes/task.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/not-found.js";
import sanitizeRequest from "./middleware/sanitizeRequest.js";
import uploadRoutes from './routes/upload.routes.js'


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

// Insted of mongoSanitize
app.use(sanitizeRequest);


// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/uploads', express.static('uploads'));

// apply limit to task route
app.use('/api/task', limiter);


app.use('/api/auth', authRoute);
app.use('/api/task',taskRoute)

// Image upload route
app.use('/api/upload', uploadRoutes)

app.use(notFound)

app.use(errorHandler);

export default app;