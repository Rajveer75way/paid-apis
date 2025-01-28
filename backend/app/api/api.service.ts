// src/modules/api/api.service.ts

import { Api } from "./api.schema";
import { CreateApiDTO } from "./api.dto";
import { Plan } from "../plan/plan.schema";  // Adjust the import path if necessary
import { AppDataSource } from "../common/services/database.service";
export class ApiService {
  private apiRepository = AppDataSource.getRepository(Api);

  async createApi(createApiDTO: CreateApiDTO): Promise<Api> {
    const { api_name, module, description, price_per_request, is_free = false, planId } = createApiDTO;
    
    // Find the plan to associate
    const plan = await AppDataSource.getRepository(Plan).findOne({ where: { plan_id: planId } });
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Create new API entry
    const api = this.apiRepository.create({
      api_name,
      module,
      description,
      price_per_request,
      is_free,
      plan,
    });

    await this.apiRepository.save(api);
    return api;
  }

  async getApiById(apiId: string): Promise<Api | undefined> {
     await this.apiRepository.findOneBy({ api_id: apiId });
     return;
  }
  async getAllApis(): Promise<Api[]> {
    return await this.apiRepository.find();
  }
}


