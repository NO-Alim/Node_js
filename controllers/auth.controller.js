// @ts-nocheck
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";


const registerUser = async (req, res, next) => {
    const {userName, email, password} = req.body || {};

    try {
        const existingUser = await User.findOne({$or: [{email}, {userName}]});

        if (existingUser) {
            if (existingUser.email === email) {
                return next(new AppError("User with this email already exist", 409));
            }
            if (existingUser.userName === userName) {
                return next(new AppError('User with this username already exist.'))
            }
        }

        const user = await User.create({userName, email, password});

        // generate token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email
            }
        })

    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body || {};

    if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
    }

    try {
        const user = await User.findOne({email}).select('+password')

        if (!user) {
            return next(new AppError('Invalid credentials', 401)); // 401 Unauthorized
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new AppError('Invalid credentials', 401)); // 401 Unauthorized
        }

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error)
    }
}

export {registerUser, loginUser}