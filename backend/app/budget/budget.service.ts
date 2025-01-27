import { AppDataSource } from "../common/services/database.service"; // Make sure you import AppDataSource
import { Budget } from "./budget.schema"; // Ensure this is pointing to your TypeORM Budget entity
import { Repository } from "typeorm";
import { Between } from "typeorm";
/**
 * Creates a new budget and saves it to the database.
 * @param {any} data - The budget data to be saved.
 * @returns {Promise<Budget>} The created budget document.
 */
export const createBudget = async (data: any): Promise<Budget> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
  const budget = budgetRepository.create(data);  // Create a new Budget entity instance
  return (await budgetRepository.save(budget)) as unknown as Budget;  // Save the new budget and return as Budget
}
/**
 * Retrieves all budgets from the database.
 * @returns {Promise<Budget[]>} An array of all budgets.
 */
export const getAllBudgets = async (): Promise<Budget[]> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
  return await budgetRepository.find();  // Retrieve all budgets
};

/**
 * Retrieves a budget by its id from the database.
 * @param {string} id - The id of the budget to be retrieved.
 * @returns {Promise<Budget | null>} The budget document or null if not found.
 */
export const getBudgetById = async (id: string): Promise<Budget | null> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
  return await budgetRepository.findOne({ where: { id: Number(id) } });  // Find a budget by id
};

/**
 * Updates a budget by its id and saves the changes to the database.
 * @param {string} id - The id of the budget to be updated.
 * @param {any} data - The updated budget data.
 * @returns {Promise<Budget | null>} The updated budget document or null if not found.
 */
export const updateBudget = async (id: string, data: any): Promise<Budget | null> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
    const budget = await budgetRepository.findOne({ where: { id: Number(id) } });
  
  if (!budget) {
    return null; 
  }
    budgetRepository.merge(budget, data);
    return await budgetRepository.save(budget);
};

/**
 * Deletes a budget by its id from the database.
 * @param {string} id - The id of the budget to be deleted.
 * @returns {Promise<Budget | null>} The deleted budget document or null if not found.
 */
export const deleteBudget = async (id: string): Promise<Budget | null> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
    const budget = await budgetRepository.findOne({ where: { id: Number(id) } });
  
  if (!budget) {
    return null;
  }
    await budgetRepository.remove(budget);
  return budget;
};

/**
 * Retrieves all budgets for a particular category and date range from the database.
 * @param {string} category - The category of the budgets to be retrieved.
 * @param {Date} startDate - The start date of the budgets to be retrieved.
 * @param {Date} endDate - The end date of the budgets to be retrieved.
 * @returns {Promise<Budget[]>} An array of all budgets matching the criteria.
 */
export const getBudgetsByCategoryAndDateRange = async (
  category: string,
  startDate: Date,
  endDate: Date
): Promise<Budget[]> => {
  const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget);
    return await budgetRepository.find({
    where: {
      category,
      startDate: Between(startDate, endDate),
    },
  });
};
