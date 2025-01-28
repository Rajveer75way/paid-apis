// src/modules/api/api.controller.ts

import { Request, Response } from "express";
import { ApiService } from "./api.service";
import { CreateApiDTO } from "./api.dto";
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.hepler";

/**
 * API controller
 */
export const apiController = {
  /**
   * Create a new API entry
   * @param req Request object
   * @param res Response object
   */
  createApi: asyncHandler(async (req: Request, res: Response) => {
    const createApiDTO: CreateApiDTO = req.body;
    const api = await new ApiService().createApi(createApiDTO);
    res.status(201).json(createResponse({ success: true, data: api }));
  }),

  /**
   * Get an API by ID
   * @param req Request object
   * @param res Response object
   */
  getApiById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { apiId } = req.params;
    const api = await new ApiService().getApiById(apiId);
    if (!api) {
      res.status(404).json(createResponse({ success: false, message: "API not found" }));
      return;
    }
    res.status(200).json(createResponse({ success: true, data: api }));
  }),
   getAllApi : asyncHandler(async (req: Request, res: Response) => {
    const result = await new ApiService().getAllApis();
    res.send(createResponse(result, "APIs retrieved successfully"));
  })
};

