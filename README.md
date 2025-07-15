- ✅ **Day 16: Register & Login with MongoDB**
    
    ### 🎯 Objective:
    
    Build a real user auth system with MongoDB and JWT.
    
    ### 📚 Topics: Build user auth system
    
    - Create `User` model with email and hashed password
    - Check for existing email before registering
    - Save password securely
    - Issue JWT on successful login
    - Send token in response
    
    ### 💻 Task:
    
    - Implement `POST /register` and `POST /login` using Mongoose
    - Save token on login and return user info (without password)
    
    ### 🔁 Assignment:
    
    - Handle validation errors (e.g., existing user, wrong password)