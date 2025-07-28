- ✅ Day 25: Deployment to Render/Railway
    
    ### 1. Create Production-Ready Folder Structure
    
    For a Node.js API that doesn't use a compilation step (like Babel or TypeScript), your current folder structure is likely fine. The main considerations for production are:
    
    - **`node_modules`:** Ensure it's in `.gitignore` and not committed to your repository. Hosting platforms will run `npm install` themselves.
    - **`.env` file:** **Crucially, your `.env` file should NEVER be committed to Git.** This contains sensitive information (database credentials, JWT secrets). You'll set these as environment variables directly on the hosting platform.
    - **Logs directory:** Your `logs` directory should also be in `.gitignore` as these are ephemeral and specific to the running instance.
    
    ### 2. Add `start` script for `package.json`
    
    Hosting platforms need to know how to start your application. This is typically done via the `start` script in your `package.json`.
    
    In your `package.json`, ensure you have a `scripts` section like this:
    
    ```jsx
    {
      "name": "secure-task-manager-api",
      "version": "1.0.0",
      "description": "A secure Node.js API for a Task Manager application.",
      "main": "server.js", // Or app.js, depending on your main entry file
      "type": "module", // If you're using ES Modules (import/export)
      "scripts": {
        "start": "node server.js", // IMPORTANT: This is what Render will use
        "dev": "nodemon server.js" // Your development script
      },
      "dependencies": {
        // ... your dependencies
      },
      "devDependencies": {
        "nodemon": "^3.0.0" // Ensure you have nodemon if using "dev" script
      }
    }
    ```
    
    **Note:** Make sure `main` points to your primary server file (e.g., `server.js` if that's where you `app.listen()` or `app.js` if that's your main entry point).
    
    ### 3. Use `.env` variables safely in production
    
    As mentioned, your `.env` file is for local development only. On Render (or any cloud platform), you will configure these variables in their dashboard, typically in a "Environment Variables" or "Settings" section for your service.
    
    ### Deploy Backend using Render
    
    Render offers continuous deployment from GitHub.
    
    1. **Push your code to GitHub:**
        - Ensure your `package.json` has the `start` script.
        - Make sure `.env` and `logs` are in `.gitignore`.
        - `git add .`
        - `git commit -m "Prepare for deployment"`
        - `git push origin main` (or your main branch name)
    2. **Sign Up/Log In to [Render.com](https://render.com/).**
    3. **Create a New Web Service:**
        - From your Render dashboard, click **"New +" -> "Web Service"**.
        - **Connect your GitHub account** and select the repository where your API code is.
        - Click **"Connect"**.
    4. **Configure your Web Service:**
        - **Name:** Give your service a unique name (e.g., `task-manager-api-yourname`).
        - **Region:** Choose a region close to your MongoDB Atlas cluster (if you set one).
        - **Branch:** `main` (or your deployment branch).
        - **Root Directory:** Leave empty if your `package.json` is at the root of the repo.
        - **Runtime:** **Node.js**.
        - **Build Command:** `npm install` (or `yarn install` if you use yarn).
        - **Start Command:** `npm start` (this corresponds to the script you added in `package.json`).
        - **Plan Type:** Choose **"Free"**.
    5. **Set Environment Variables:**
        - Scroll down to the "Advanced" section.
        - Click "Add Environment Variable".
        - Add **all** the variables from your local `.env` file here. This is crucial for your app to function.
            - `NODE_ENV`: `production`
            - `PORT`: `5000` (Render will map this to an external port)
            - `MONGO_URI`: (Paste the full connection string from MongoDB Atlas here)
            - `JWT_SECRET`: (Your strong secret)
            - `JWT_EXPIRES_IN`: (e.g., `90d`)
            - `JWT_COOKIE_EXPIRES_IN`: (e.g., `90`)
            - `FRONTEND_URL`: (Your frontend domain, or  for initial testing if applicable, but better to be specific)
            - `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT` (if you implemented email functionality)
        - **Click "Create Web Service".**
    6. **Monitor Deployment:**
        - Render will automatically start building and deploying your service.
        - You'll see a log stream showing the build process. Watch for errors.
        - Once deployed, the status will show "Live", and you'll get a public URL for your API (e.g., `https://task-manager-api-yourname.onrender.com`).
    
    ### **Use logs to debug deployment issues**
    
    - On your Render service dashboard, click the **"Logs"** tab.
    - This is your primary tool for debugging.
    - **Common Issues to look for:**
        - **`npm install` errors:** Missing dependencies, incorrect `package.json`.
        - **`npm start` errors:** Incorrect `start` script, `server.js` not found.
        - **Port binding errors:** Usually not an issue with Render as it handles this, but your app must listen on `process.env.PORT` or a fixed port (like `5000` which Render usually expects).
        - **MongoDB connection errors:**
            - Incorrect `MONGO_URI` (typo, wrong credentials).
            - MongoDB Atlas network access: Did you allow access from `0.0.0.0/0` or the correct IP range?
            - Database user credentials incorrect.
        - **Missing Environment Variables:** Your app crashing because `process.env.JWT_SECRET` is `undefined`. Double-check *all* `.env` variables are added to Render's dashboard.