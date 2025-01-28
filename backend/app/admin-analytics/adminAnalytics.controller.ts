import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AdminAnalyticsService } from "./adminAnalytics.service";

const adminAnalyticsService = new AdminAnalyticsService();

/**
 * @description Get all user details (excluding admins)
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with user details
 */
export const getUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const users = await adminAnalyticsService.getUsers();
    res.status(200).json(users);
  }
);

/**
 * @description Get plan usage details
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with plan usage details
 */
export const getPlanUsage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const planUsage = await adminAnalyticsService.getPlanUsage();
    res.status(200).json(planUsage);
  }
);

/**
 * @description Get overall analytics (revenue, requests, etc.)
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with overall analytics
 */
export const getAnalytics = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const analytics = await adminAnalyticsService.getAnalytics();
    res.status(200).json(analytics);
  }
);
