import AppError from "../utils/AppError.js";
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err }; // shallow copy of the error object

    
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    error.message = error.message || 'Something went wrong!'; // Default message

    // 2. Handle Specific Error Types and Convert to Operational Errors (AppError)
    //    These transformations make the error 'operational' and user-friendly.

    // Mongoose CastError (e.g., invalid ID format in URL params)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}.`;
        error = new AppError(message, 400);
        error.isOperational = true; // Mark as operational
    }

    // Mongoose ValidationError (e.g., schema validation failed during save/update)
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data: ${errors.join(". ")}`;
        error = new AppError(message, 400);
        error.isOperational = true;
    }

    // Mongoose Duplicate Key Error (MongoDB error code 11000)
    if (err.code === 11000) {
        // Extract the value that caused the duplicate error (e.g., 'test@example.com')
        const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
        const message = `Duplicate field value: '${value}'. Please use another value!`;
        error = new AppError(message, 400);
        error.isOperational = true;
    }
    if (process.env.NODE_ENV === 'development') {
        // In development, log the full original error object for deep debugging
        logger.error(err);
    } else {
        // In production, log a structured error with relevant context.
        // Stack trace is crucial for programming errors but should be kept internal.
        logger.error(`Prod Error: ${error.message}`, {
            statusCode: error.statusCode,
            status: error.status,
            ip: req.ip,
            url: req.originalUrl,
            method: req.method,
            user: req.user ? req.user.id : 'N/A', // Assuming req.user exists if authenticated
            // body: req.body, // CAUTION: Only log req.body if it doesn't contain sensitive info
            stack: error.stack // Log stack trace internally for programming errors
        });
    }

    // 4. Send Response to Client (based on environment and error type)
    if (process.env.NODE_ENV === "development") {
        // In development, send detailed error info for easy debugging
        res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
            stack: error.stack, // Expose stack trace in development
            error: error,       // Provide the full error object
        });
    } else {
        // In production, differentiate between operational and programming errors
        if (error.isOperational) {
            // Operational errors (e.g., validation, invalid ID, duplicate key) are "trusted" errors
            // that we explicitly created. Their messages are safe to send to the client.
            res.status(error.statusCode).json({
                success: false,
                status: error.status,
                message: error.message,
            });
        } else {
            // Programming errors or other unknown errors (e.g., database connection down, typo in code)
            // are internal server errors. We should not leak their details to the client.
            // A generic message is sent, while the full error details are logged internally by Winston.
            res.status(500).json({
                success: false,
                status: 'error',
                message: "Something went wrong! Please try again later.",
            });
        }
    }
};

export default errorHandler;