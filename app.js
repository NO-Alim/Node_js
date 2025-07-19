import express from "express";
import authRoute from "./routes/auth.routes.js";
import taskRoute from "./routes/task.routes.js";
import AppError from "./utils/AppError.js";
import errorHandler from "./middleware/errorHandler.js";
import nodemon from "nodemon";
import notFound from "./middleware/not-found.js";
import protect from "./middleware/authMiddleware.js";
import authorizeRole from "./middleware/authorizeRoles.js";


const app = express();
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/task',protect, authorizeRole('admin'), taskRoute)

app.use(notFound)

app.use(errorHandler);

export default app;