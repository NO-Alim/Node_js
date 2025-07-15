import express from "express";
import authRoute from "./routes/auth.routes.js";
import AppError from "./utils/AppError.js";
import errorHandler from "./middleware/errorHandler.js";
import nodemon from "nodemon";
import notFound from "./middleware/not-found.js";


const app = express();
app.use(express.json());

app.use('/api/auth', authRoute);

app.use(notFound)

app.use(errorHandler)

export default app;