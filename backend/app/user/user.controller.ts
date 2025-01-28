import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {User} from "./user.schema"; // Use the TypeORM User entity
import { getRegisteredUsersByDateRange } from "./user.service";
import { AppDataSource } from "../common/services/database.service";
import { Between } from "typeorm";
import  {PlanService} from "../plan/plan.service";

/**
 * @description Create a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the created user or an error message
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  console.log(result);
  res.send(createResponse(result, "User created successfully"));
});

/**
 * @description Update password of an existing user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the updated user or an error message
 */
export const createUpdatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.createUpdatePassword(req.body);
    res.send(createResponse(result, "Password updated successfully"));
  }
);



/**
 * @description Get registered users between a given date range
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the result of the operation
 */
export const handleGetRegisteredUsers = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).send({
      success: false,
      message: "Please provide both startDate and endDate in the request body",
    });
  }
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);
  const result = await AppDataSource.getRepository(User).find({
    where: {
      createdAt: Between(start, end),
    },
    select: ["id", "name", "email", "role", "active"], // Select only the fields you need
  });

  res.status(200).send({
    success: true,
    message: "Users retrieved successfully",
    data: { registeredUsers: result },
  });
};


/**
 * @description Login an existing user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the result of the operation
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.loginUser(req.body);
  res.send(createResponse(result, "User logged in successfully"));
});

/**
 * @description Update an existing user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the updated user or an error message
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser((req.params.id), req.body);
  res.send(createResponse(result, "User updated successfully"));
});

/**
 * @description Edit an existing user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the updated user or an error message
 */
export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser((req.params.id),  req.body);
  res.send(createResponse(result, "User updated successfully"));
});

/**
 * @description Delete an existing user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the result of the operation
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted successfully"));
});

/**
 * @description Get a user by ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the user or an error message
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id; // Extract userId from the request
if (!userId) {
  res.status(400).send(createResponse(null, "User ID is required"));
  return;
}
  const result = await userService.getUserById(userId);
  res.send(createResponse(result));
});

/**
 * @description Get all users
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the result of the operation
 */
export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  res.send(createResponse(result));
});

/**
 * @description Get all users
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the result of the operation
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.refreshToken(req.body.refreshToken);
    res.send(createResponse(result));
  },
);
export const subscribeToPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id; // Extract userId from the request
  const { planId } = req.body; // Extract planId from the request body
  // Ensure both userId and planId are provided
  if (!userId || !planId) {
    res.status(400).send(createResponse(null, "User ID and Plan ID are required"));
    return; // Make sure to stop further execution after sending the response
  }

  // Fetch the plan by ID
  const plan = await new PlanService().getPlanById(planId);
  if (!plan) {
    res.status(404).send(createResponse(null, "Plan not found"));
    return;
  }

  // Subscribe the user to the plan using the UserService
  const updatedUser = await userService.subscribeToPlan(userId, plan);

  // Return success response
  res.status(200).send(createResponse(updatedUser, "User subscribed to plan successfully"));
});

