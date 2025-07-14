- ✅ **Day 15: Intro to Authentication (JWT & bcrypt)**
    
    ### 🎯 Objective:
    
    Understand how user authentication works using tokens, and how passwords are hashed securely.
    
    ### 📚 Topics:
    
    - What is authentication? What is authorization?
        
        These two terms are often confused, but they represent distinct concepts:
        
        - **Authentication (Who are you?):** This is the process of **verifying the identity** of a user, system, or entity. It's about proving that someone is who they claim to be.
            - **Analogy:** Showing your ID at the entrance of a building. The ID proves you are John Doe.
            - **In APIs:** A user provides a username and password (or a token), and the system verifies if those credentials match a known identity.
        - **Authorization (What can you do?):** This is the process of **determining what an authenticated user is permitted to do** or access. Once you've proven who you are, authorization dictates what resources or actions you have permission for.
            - **Analogy:** After showing your ID, the building's security checks your access level. Can you enter only the lobby, or also restricted floors, or even the server room?
            - **In APIs:** After a user is authenticated, the API checks if they have the necessary permissions to access a specific endpoint (e.g., only admins can delete books, regular users can only view them).
        
        **Key Takeaway:** You must authenticate *before* you can authorize. You can't grant someone permission to do something if you don't even know who they are.
        
        ### 
        
    - Why store passwords as hashes?
        
        This is perhaps the most critical security lesson for handling user data.
        
        **NEVER store plain-text passwords in your database.**
        
        Here's why:
        
        - **Data Breaches:** Databases are targets. If your database is compromised and passwords are in plain text, attackers immediately have access to all user accounts, not just on your platform, but potentially on any other service where users reuse passwords (which is common).
        - **Insider Threats:** Even trusted employees with database access could potentially see sensitive user passwords.
        - **Compliance & Trust:** Storing plain passwords is a major security vulnerability that can lead to legal issues, reputational damage, and a complete loss of user trust.
        
        **The Solution: Hashing**
        
        Instead of storing the password itself, we store a **hash** of the password.
        
        - **Hashing Function:** A one-way mathematical function that takes an input (the password) and produces a fixed-size, seemingly random string of characters (the hash).
        - **One-Way:** It's computationally infeasible to reverse the hashing process to get the original password from the hash.
        - **Deterministic:** The same input *always* produces the same output.
        - **Collision Resistance:** It's very difficult to find two different inputs that produce the same output. (Though "collisions" are theoretically possible with enough attempts, good hashing algorithms make it extremely difficult).
        
        **How it works during login:**
        
        1. User enters password.
        2. Your application hashes the entered password.
        3. Your application compares this newly generated hash with the hash stored in the database for that user.
        4. If the hashes match, the password is correct. If they don't, it's incorrect.
        
        **What about "Salting"?**
        
        Modern password hashing uses "salting" to further enhance security.
        
        - **Salt:** A random, unique string of data added to the password *before* it's hashed.
        - **Why?** If two users have the same password (e.g., "password123"), their hashes would be identical without salting. This allows attackers to use "rainbow tables" (precomputed hashes) to quickly crack common passwords. By adding a unique salt to each password before hashing, even identical passwords will produce *different* hashes in your database, rendering rainbow tables useless. The salt is usually stored alongside the hash in the database.
    - Installing and using `bcrypt` to hash and compare passwords
        
        `bcrypt` is a popular and robust password-hashing library. It's designed to be slow, which is a good thing for hashing (it makes brute-force attacks much harder). It also handles salting automatically.
        
        **Installation:**
        
        ```jsx
        npm install bcrypt
        ```
        
        ```jsx
        const bcrypt = require('bcrypt');
        
        // --- Hashing a password ---
        async function hashPassword(password) {
            const saltRounds = 10; // The number of rounds to use for the salt. Higher means more secure, but slower. 10-12 is common.
            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                console.log('Hashed Password:', hashedPassword);
                return hashedPassword;
            } catch (error) {
                console.error('Error hashing password:', error);
                throw error;
            }
        }
        
        // --- Comparing a password ---
        async function comparePassword(plainPassword, hashedPassword) {
            try {
                const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
                console.log('Password Match:', isMatch);
                return isMatch;
            } catch (error) {
                console.error('Error comparing password:', error);
                throw error;
            }
        }
        ```
        
    - What is JWT (JSON Web Token)?
        
        JWT (pronounced "jot") stands for **JSON Web Token**. It's a compact, URL-safe means of representing claims to be transferred between two parties. These claims are digitally signed, so they can be verified and trusted.
        
        - **Token-Based Authentication:** Instead of using session IDs stored on the server (which require server-side state), JWTs allow for stateless authentication. Once a user logs in, they receive a JWT. This token is then sent with every subsequent request (usually in the `Authorization` header), and the server can verify it without needing to query a database for session information.
        
        **Why JWT?**
        
        - **Statelessness:** The server doesn't need to store session information, making it easier to scale horizontally (add more servers).
        - **Decentralization:** Tokens can be issued by one service and consumed by others (e.g., microservices architecture).
        - **Mobile-Friendly:** Ideal for mobile applications and APIs, as they don't rely on cookies.
        - **Security:** Digitally signed to prevent tampering.
    - How JWT works (header, payload, signature)
        
        A JWT consists of **three parts**:
        
        ### 1. **Header**
        
        - Specifies the type of the token and the signing algorithm.
        - Example:
        
        ```json
        
        {
          "alg": "HS256",
          "typ": "JWT"
        }
        
        ```
        
        ### 2. **Payload**
        
        - Contains the actual data (claims). These can be:
            - **Registered claims** (e.g., `iss`, `exp`, `sub`, `aud`)
            - **Public claims** (can be defined by anyone)
            - **Private claims** (custom between two parties)
        - Example:
        
        ```json
        
        {
          "sub": "1234567890",
          "name": "John Doe",
          "admin": true,
          "exp": 1711234567
        }
        
        ```
        
        ### 3. **Signature**
        
        - Ensures the token has not been altered.
        - Created by encoding the header and payload, then signing it using a secret key or a private key.
        
        ```bash
        
        HMACSHA256(
          base64UrlEncode(header) + "." + base64UrlEncode(payload),
          secret
        )
        
        ```
        
        ---
        
        ---
        
        ## ✅ How JWT Is Used in Authentication
        
        1. **Login**: User logs in with username/password.
        2. **Token Generation**: Server validates user and sends a JWT.
        3. **Client Storage**: Client stores JWT (typically in localStorage or cookies).
        4. **Authenticated Requests**: Client sends JWT in `Authorization` header:
            
            ```
            
            Authorization: Bearer <token>
            
            ```
            
        5. **Server Verification**: Server decodes JWT, verifies signature and expiry.
        6. **Access Granted or Denied**.
        
        ---
        
        ## ⚠️ Important Notes
        
        - **Do not store sensitive info** (e.g., password) in the payload.
        - JWT is **not encrypted**, just base64url-encoded.
        - Always **verify the signature** before trusting the token.
    
    ### 💻 Task:
    
    - Hash a password using `bcrypt.hash()`
    - Compare a password using `bcrypt.compare()`
    - Generate a token using `jsonwebtoken.sign()`
    - Decode and verify token using `jsonwebtoken.verify()`