import express from "express";
import { getTask } from "../controllers/task.controller.js";

const router = express.Router();

router.get('/', getTask)


export default router;