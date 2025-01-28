import express from "express";
import expensesRoutes from "./api-request/apiRequest.route";
import budgetRoutes from "./plan/plan.route";
import financialRoutes from "./admin-analytics/adminAnalytics.route";
import userRoutes from './user/user.route'
import planRoutes from './plan/plan.route'
import apisRoutes from './api/api.route'
import apiRequestRoutes from './api-request/apiRequest.route'
import adminRoutes from './admin-analytics/adminAnalytics.route'
const router = express.Router();

// router.use('/expenses', expensesRoutes);
// router.use('/budgets', budgetRoutes);
// router.use('/financial', financialRoutes);
router.use('/plans', planRoutes)
router.use('/users', userRoutes)
router.use('/apis', apisRoutes)
router.use('/api-requests', apiRequestRoutes)
router.use('/admin-analytics', adminRoutes)


export default router;