import { AppDataSource } from "../common/services/database.service";
import { User } from "../user/user.schema";
import { Api } from "../api/api.schema";
import { Between } from "typeorm";
import { Plan } from "../plan/plan.schema";
import { PlanDTO } from "./plan.dto";
export class PlanService {
  /**
   * Repository for accessing plans in the database
   * @private
   */
  private planRepository = AppDataSource.getRepository(Plan);
  /**
   * Create a new plan
   * @param {PlanDTO} planDTO - The plan data to create
   * @returns {Promise<Plan>} - The created plan
   */
  public async createPlan(planDTO: PlanDTO): Promise<Plan> {
    const plan = this.planRepository.create(planDTO);
    return await this.planRepository.save(plan);
  }
  /**
   * Get all plans
   * @returns {Promise<Plan[]>} - The list of all plans
   */
  public async getAllPlans(): Promise<Plan[]> {
    return await this.planRepository.find();
  }

  /**
   * Get a plan by id
   * @param {string} id - The id of the plan to retrieve
   * @returns {Promise<Plan | null>} - The plan if found, otherwise null
   */
  public async getPlanById(id: string): Promise<Plan | null> {
    const plan = await this.planRepository.findOne({ where: { plan_id: id } });
    if (!plan) throw new Error("Plan not found");
    return plan;
  }

  /**
   * Update a plan by id
   * @param {string} id - The id of the plan to update
   * @param {PlanDTO} planDTO - The updated plan data
   * @returns {Promise<Plan>} - The updated plan
   */
  public async updatePlan(id: string, planDTO: PlanDTO): Promise<Plan> {
    const plan = await this.getPlanById(id);
    if (!plan) throw new Error("Plan not found");

    // Update plan properties
    Object.assign(plan, planDTO);
    return await this.planRepository.save(plan);
  }

  /**
   * Delete a plan by id
   * @param {string} id - The id of the plan to delete
   * @returns {Promise<void>} - Nothing, but throws an error if the plan is not found
   */
  public async deletePlan(id: string): Promise<void> {
    const plan = await this.getPlanById(id);
    if (!plan) throw new Error("Plan not found");

    await this.planRepository.remove(plan);
  }
}
