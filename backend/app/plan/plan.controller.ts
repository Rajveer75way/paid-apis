/**
 * Controller for managing plans
 */
import { Request, Response } from "express";
import { PlanService } from "./plan.service";
import { PlanDTO } from "./plan.dto";
import asyncHandler from "express-async-handler";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";
import { createResponse } from "../common/helper/response.hepler";

/**
 * Class representing a plan controller
 */
export class PlanController {
  /**
   * The plan service instance
   */
  private planService: PlanService;

  /**
   * Creates a new instance of the plan controller
   */
  constructor() {
    this.planService = new PlanService();
  }

  /**
   * Creates a new plan
   * @param req The request object
   * @param res The response object
   */
  public createPlan = asyncHandler(async (req: Request, res: Response) => {
    const planDTO = plainToInstance(PlanDTO, req.body);
    // await validateOrReject(planDTO); // Validate incoming request

    const plan = await this.planService.createPlan(planDTO);
    res.status(201).json(createResponse(plan, "Plan created successfully"));
  });

  /**
   * Retrieves a list of all plans
   * @param req The request object
   * @param res The response object
   */
  public getPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = await this.planService.getAllPlans();
    res.status(200).json(createResponse(plans, "Plans retrieved successfully"));
  });

  /**
   * Retrieves a single plan by id
   * @param req The request object
   * @param res The response object
   */
  public getPlan = asyncHandler(async (req: Request, res: Response) => {
    const plan = await this.planService.getPlanById(req.params.id);
    res.status(200).json(createResponse(plan, "Plan retrieved successfully"));
  });

  /**
   * Updates a plan by id
   * @param req The request object
   * @param res The response object
   */
  public updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const planDTO = plainToInstance(PlanDTO, req.body);
    await validateOrReject(planDTO);

    const updatedPlan = await this.planService.updatePlan(req.params.id, planDTO);
    res.status(200).json(createResponse(updatedPlan, "Plan updated successfully"));
  });

  /**
   * Deletes a plan by id
   * @param req The request object
   * @param res The response object
   */
  public deletePlan = asyncHandler(async (req: Request, res: Response) => {
    await this.planService.deletePlan(req.params.id);
    res.status(200).json(createResponse(null, "Plan deleted successfully"));
  });
}

