import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {User} from "./user.schema"; // Use the TypeORM User entity
import { getRegisteredUsersByDateRange } from "./user.service";
import { AppDataSource } from "../common/services/database.service";
import { Between } from "typeorm";

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
 * @description Get count of active users
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} Returns a JSON response with the count of active users
 */
export const getActiveUserCount = async (req: Request, res: Response) => {
  try {
    const activeUserCount = await userService.getActiveUserCount();
    res.send(
      createResponse(activeUserCount, "Active user count fetched successfully")
    );
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch active user count", error: error });
  }
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
  const result = await userService.getUserById((req.params.id));
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
