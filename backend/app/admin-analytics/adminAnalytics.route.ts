import express from "express";
import { getUsers, getPlanUsage, getAnalytics } from "./adminAnalytics.controller";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = express.Router();

// Route to fetch all users (excluding admins)
router.get("/users", roleAuth(["ADMIN"]), getUsers);

// Route to fetch plan usage details
router.get("/plan-usage", roleAuth(["ADMIN"]), getPlanUsage);

// Route to fetch overall analytics
router.get("/", roleAuth(["ADMIN"]), getAnalytics);

export default router;
