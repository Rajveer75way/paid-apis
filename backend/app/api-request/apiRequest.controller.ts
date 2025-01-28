/**
 * Controller for API requests
 */
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ApiRequestService } from "./apiRequest.service";
import { CreateApiRequestDto, ApiRequestResponseDto } from "./apiRequest.dto";
import { AppDataSource } from "../common/services/database.service";
import { User } from "../user/user.schema";

/**
 * Initialize the ApiRequestService instance
 */
const apiRequestService = new ApiRequestService();

/**
 * Create a new API request
 * @param req Request object
 * @param res Response object
 */
export const createApiRequest = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const createApiRequestDto: CreateApiRequestDto = req.body;

    // Validate input
    if (!createApiRequestDto.apiId || !createApiRequestDto.cost) {
      res.status(400).json({ message: "apiId and cost are required" });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Fetch the user with the plan
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ["plan"],
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Check if the user has an active plan
    if (!user.plan) {
      res
        .status(400)
        .json({ message: "Please purchase a plan to make API requests" });
      return;
    }

    // Create a new API request
    const apiRequest = await apiRequestService.createApiRequest(
      userId,
      createApiRequestDto.apiId,
      createApiRequestDto.cost,
      user // Pass the user to handle the plan and cost logic in the service
    );

    // Return the newly created API request
    res.status(201).json({
      request_id: apiRequest.request_id,
      userId: apiRequest.user.id,
      apiId: apiRequest.api.api_id,
      request_date: apiRequest.request_date,
      cost: apiRequest.cost,
    } as ApiRequestResponseDto);
  }
);

/**
 * Get all API requests
 * @param req Request object
 * @param res Response object
 */
export const getAllApiRequests = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const apiRequests = await apiRequestService.getAllApiRequests();
    res.status(200).json(apiRequests);
  }
);

/**
 * Get an API request by ID
 * @param req Request object
 * @param res Response object
 */
export const getApiRequestById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.params;
    const apiRequest = await apiRequestService.getApiRequestById(requestId);
    if (apiRequest) {
      res.status(200).json(apiRequest);
    } else {
      res.status(404).json({ message: "API Request not found" });
    }
  }
);

