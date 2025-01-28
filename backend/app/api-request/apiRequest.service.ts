import { AppDataSource } from "../common/services/database.service";
import { ApiRequest } from "./apiRequest.schema";
import { User } from "../user/user.schema";
import { Api } from "../api/api.schema";
import { Between } from "typeorm";
import { Plan } from "../plan/plan.schema";
export class ApiRequestService {
  /**
   * The repository for ApiRequest entities.
   */
  private apiRequestRepository = AppDataSource.getRepository(ApiRequest);

  /**
   * Creates a new API request.
   * 
   * @param userId The ID of the user making the request.
   * @param apiId The ID of the API being requested.
   * @param cost The cost of the request.
   * @param user The user entity to associate with the request.
   * @returns The newly created ApiRequest entity.
   */
  async createApiRequest(userId: string, apiId: string, cost: number, user: User): Promise<ApiRequest> {
    const api = await AppDataSource.getRepository(Api).findOne({ where: { api_id: apiId } });
    if (!api) {
      throw new Error("API not found");
    }

    // Calculate the cost to deduct from the user's balance
    let costToDeduct = cost;
    const plan = user.plan;
    if (plan) {
      // Check if user has free requests available
      if (plan.free_requests > 0) {
        // Deduct a free request
        plan.free_requests -= 1;
        await AppDataSource.getRepository(Plan).save(plan);
        costToDeduct = 0; // No charge for this request
      } else {
        // Deduct from user balance if no free requests are available
        if (user.balance < costToDeduct) {
          throw new Error("Insufficient balance");
        }
        user.balance -= costToDeduct;
      }
      await AppDataSource.getRepository(User).save(user);
    }

    // Create the API request record
    const apiRequest = this.apiRequestRepository.create({
      user,
      api,
      cost: costToDeduct,
    });
    await this.apiRequestRepository.save(apiRequest);
    return apiRequest;
  }

  /**
   * Gets all API requests made by a user.
   * 
   * @param userId The ID of the user to retrieve requests for.
   * @returns An array of ApiRequest entities.
   */
  async getApiRequestsByUser(userId: string): Promise<ApiRequest[]> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ["apiRequests", "apiRequests.api"], // Include api details in the response
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.apiRequests;
  }

  /**
   * Gets all API requests made to an API.
   * 
   * @param apiId The ID of the API to retrieve requests for.
   * @returns An array of ApiRequest entities.
   */
  async getApiRequestsByApi(apiId: string): Promise<ApiRequest[]> {
    const api = await AppDataSource.getRepository(Api).findOne({
      where: { api_id: apiId },
      relations: ["apiRequests", "apiRequests.user"], // Include user details in the response
    });
    if (!api) {
      throw new Error("API not found");
    }
    return api.apiRequests;
  }

  /**
   * Gets all API requests within a date range.
   * 
   * @param startDate The start of the date range.
   * @param endDate The end of the date range.
   * @returns An array of ApiRequest entities.
   */
  async getApiRequestsByDateRange(startDate: Date, endDate: Date): Promise<ApiRequest[]> {
    const apiRequests = await this.apiRequestRepository.find({
      where: {
        request_date: Between(startDate, endDate), // Use Between for date range filtering
      },
      relations: ["user", "api"], // Include user and api relations
    });

    return apiRequests;
  }

  /**
   * Gets all API requests.
   * 
   * @returns An array of ApiRequest entities.
   */
  async getAllApiRequests(): Promise<ApiRequest[]> {
    const apiRequests = await this.apiRequestRepository.find({
      relations: ["user", "api"], // Include user and api relations
    });

    return apiRequests;
  }

  /**
   * Gets an API request by ID.
   * 
   * @param requestId The ID of the API request to retrieve.
   * @returns The ApiRequest entity or null if not found.
   */
  async getApiRequestById(requestId: string): Promise<ApiRequest | null> {
    const apiRequest = await this.apiRequestRepository.findOne({
      where: { request_id: requestId },
      relations: ["user", "api"], // Include user and api relations
    });

    return apiRequest;
  }
}

