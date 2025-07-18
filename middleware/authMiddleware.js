// @ts-nocheck
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Auth Middleware: Received token for verification:', token);
        console.log('Auth Middleware: Token found in headers:', token ? '[TOKEN_PRESENT]' : 'None');
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401))
    }
    try {
        console.log('Auth Middleware: Current server time (ms):', Date.now());
        console.log('Auth Middleware: JWT_SECRET used:', process.env.JWT_SECRET ? '[SECRET_PRESENT]' : 'None');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware: Token decoded payload:', decoded);

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = currentUser;
    console.log('Auth Middleware: User attached to req.user:', req.user.userName);
    next();
        
    } catch (error) {
        console.error('Auth Middleware: Error name:', error.name);
        console.error('Auth Middleware: Error message:', error.message);
        next(error);
    }
}

export default protect;