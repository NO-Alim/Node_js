- ✅ **Day 18: Role-Based Authorization**
    
    ### 🎯 Objective:
    
    Differentiate between admin and normal users and restrict actions.
    
    ### 📚 Topics:
    
    - Add `role` field to User model (e.g., `"user"`, `"admin"`)
        
        The first step in implementing RBAC is to store the user's role directly in their document in the database.
        
        **Concept:** We'll add a new field named `role` to our `User` schema. This field will typically be a string, with predefined values like `'user'` (for regular users) and `'admin'` (for administrators). You can have more roles like `'editor'`, `'moderator'`, etc., as your application grows.
        
        **Modification to `models/user.model.js`:**
        
        We'll add the `role` field with a default value of `'user'`. This means any new user registered will automatically be a regular user unless explicitly set otherwise (e.g., manually in the database, or via a separate admin interface).
        
        ```jsx
        //user.model.js
        // @ts-nocheck
        import mongoose from "mongoose";
        import bcrypt from "bcrypt";
        import jwt from "jsonwebtoken";
        
        const userSchema  =new mongoose.Schema({
            userName: {
                type: String,
                required: [true, 'Please add a username.'],
                unique: true,
                trim: true,
                minlength: [3, 'Username must be at least 3 characters long.']
            },
            email: {
                type: String,
                required: [true, 'Please add an email'],
                unique: true,
                trim: true,
                lowercase: true, 
                match: [
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    'Please add a valid email'
                ]
            },
            password: {
                type: String,
                required: [true, 'Please add a password'],
                minlength: [6, 'Password must be at least 6 characters long'],
                select: false
            },
            // --------- New -----------
            role: {
                type: String,
                enum: ['user', 'admin'],
                default: 'user'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        });
        
        // Mongoose pre-save middleware to hash password before saving
        userSchema.pre('save', async function (next) {
            if (!this.isModified('password')) {
                next();
            }
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        })
        
        // Method to compre entered password with hashed password
        userSchema.methods.comparePassword = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        }
        
        // Method to get JWT for user
        userSchema.methods.getSignedJwtToken = function() {
            const secret = process.env.JWT_SECRET || 'helloWorld';
            const options = {
                expiresIn: process.env.JWT_EXPIRES_IN || 3600
            };
        
            return jwt.sign(
                {id: this._id, email: this.email, userName: this.userName, role: this.role},
                secret,
                options
            )
        }
        
        const User = mongoose.model('User', userSchema);
        
        export default User;
        ```
        
        **Important Note:** If you have existing users in your database, they won't automatically have a `role` field. You might need to manually update them in MongoDB (e.g., `db.users.updateMany({}, { $set: { role: 'user' } })`) or create a migration script. For testing, you can register new users or manually set one user's role to 'admin' in your MongoDB client.
        
    - Create `authorizeRoles(...roles)` middleware
        
        This is the core of our role-based authorization. This middleware will check if the authenticated user's role matches any of the allowed roles for a specific route.
        
        **Concept:**
        
        - It's a "curried" middleware function, meaning it returns another middleware function. This allows us to pass arguments (the allowed roles) when we use it in our routes.
        - It relies on `req.user` being populated by the `protect` middleware. Therefore, `authorizeRoles` **must always be used *after* `protect`**.
        - If the user's role is not in the list of allowed roles, it throws a `403 Forbidden` error.
    
    ```jsx
    //authorizeRoles.js
    
    import AppError from "../utils/AppError.js";
    
    const authorizeRole = (...roles) => {
        return (req, res, next) => {
            if (!req.user || !req.user.role) {
                return next(new AppError('User role not found in token.', 403));
            }
    
            if (!roles.includes(req.user.role)) {
                return next(new AppError(
                    `User with role '${req.user.role}' is not authorized to access this route.`,
                    403
                ));
            }
            next();
        }
    }
    ```
    
    - Check `req.user.role` to allow/disallow route access
        
        This is how we apply the `authorizeRoles` middleware in our route definitions.
        
        **Concept:** When you define a route, you can chain multiple middleware functions. They execute in order. So, `protect` runs first, populates `req.user`, and then `authorizeRoles` runs, using `req.user.role` to make its decision.
        
        ```jsx
        // app.js
        app.use('/api/task',protect, authorizeRole('admin'), taskRoute)
        ```
        
        - `protect` ensures the user is logged in and attaches `req.user`.
        - `authorizeRoles('admin')` then checks if `req.user.role` is `'admin'`.
        - If both pass, taskRoute is executed.
    
    ### 💻 Task:
    
    - Protect routes like /api/task → only for admin
    - Test with multiple users having different roles
    
    ### 🔁 Assignment:
    
    - Restrict access to one or more routes based on role