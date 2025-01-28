import { AppDataSource } from "../common/services/database.service";
import { User } from "../user/user.schema";
import { ApiRequest } from "../api-request/apiRequest.schema";
import { Plan } from "../plan/plan.schema";
export class AdminAnalyticsService {
  /**
   * Constructor
   */
  constructor(
    private readonly userRepository = AppDataSource.getRepository(User),
    private readonly apiRequestRepository = AppDataSource.getRepository(
      ApiRequest
    ),
    private readonly planRepository = AppDataSource.getRepository(Plan)
  ) {}
  /**
   * Get all users (excluding admins) with their details
   * @returns {Promise<any[]>} Array of users with their details
   */
  async getUsers(): Promise<any[]> {
    const users = await this.userRepository.find({
      where: { role: "USER" }, // Exclude admins
      relations: ["plan"], // Include plan details in the user data
    });
    // Map the user data to the required format
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      plan: user.plan ? user.plan.plan_name : "No Plan",
    }));
  }

  /**
   * Get plan usage details
   * @returns {Promise<any[]>} Array of plans with their usage details
   */
  async getPlanUsage(): Promise<any[]> {
    const plans = await this.planRepository.find({
      relations: ["users"], // Include users in each plan
    });

    // Map the plan data to the required format
    return plans.map((plan) => {
      // Filter out admins from the users in the plan
      const nonAdminUsers = plan.users.filter((user) => user.role !== "ADMIN");

      // Return the plan details with the users
      return {
        plan_id: plan.plan_id,
        plan_name: plan.plan_name,
        total_users: nonAdminUsers.length,
        users: nonAdminUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          balance: user.balance,
        })),
      };
    });
  }

  /**
   * Get overall analytics (total revenue, requests, etc.)
   * @returns {Promise<any>} Object with the overall analytics
   */
  async getAnalytics(): Promise<any> {
    // Total Users
    const totalUsers = await this.userRepository
      .createQueryBuilder("user")
      .where("user.role != :role", { role: "ADMIN" })
      .getCount();

    // Total Revenue
    const totalRevenue = await this.apiRequestRepository
      .createQueryBuilder("apiRequest")
      .select("SUM(apiRequest.cost)", "totalRevenue")
      .getRawOne();

    // Total API Requests
    const totalRequests = await this.apiRequestRepository.count();

    // Monthly Revenue
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const monthlyRevenue = await this.apiRequestRepository
      .createQueryBuilder("apiRequest")
      .select("SUM(apiRequest.cost)", "monthlyRevenue")
      .where("apiRequest.request_date BETWEEN :start AND :end", {
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      })
      .getRawOne();

    // Return the overall analytics
    return {
      total_users: totalUsers,
      total_revenue: parseFloat(totalRevenue?.totalRevenue || "0"),
      total_requests: totalRequests,
      monthly_revenue: parseFloat(monthlyRevenue?.monthlyRevenue || "0"),
    };
  }
}
