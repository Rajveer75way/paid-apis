import { AppDataSource } from '../common/services/database.service';  // Import the initialized AppAppDataSource
import { Budget } from '../budget/budget.schema';
import { Between } from 'typeorm';
import moment from 'moment'; // For date manipulation
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from './expenses.schema';
/**
 * Create a new expense and save it to the database.
 * @param {any} data - The expense data to be saved.
 * @returns {Promise<Expense>} The created expense document.
 */
export const createExpense = async (data: any) => {
  const { category, amount } = data;

  const budgetRepo = AppDataSource.getRepository(Budget);
  // const budget = await budgetRepo.findOneBy({ category });  // Using AppDataSource for operations

  // if (!budget) {
  //   throw new Error(`No budget exists for the category "${category}".`);
  // }

  // Check if the expense amount exceeds the remaining budget
  // if (amount > budget.amount) {
  //   throw new Error(
  //     `Expense amount $${amount.toFixed(2)} exceeds the available budget of $${budget.amount.toFixed(2)} for the category "${category}".`
  //   );
  // }

  // // Deduct the expense amount from the remaining budget
  // budget.amount -= amount;
  // await budgetRepo.save(budget);

  const expenseRepo = AppDataSource.getRepository(Expense);
  const expense = expenseRepo.create(data);  // Create the expense
  return expenseRepo.save(expense);  // Save the expense to the database
};

/**
 * Retrieve all expenses from the database.
 * @returns {Promise<Expense[]>} A list of all expenses.
 */
export const getAllExpenses = async () => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  return expenseRepo.find();  // Fetch all expenses
};

/**
 * Get a specific expense by its ID.
 * @param {string} id - The ID of the expense to be retrieved.
 * @returns {Promise<Expense>} The retrieved expense.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const getExpenseById = async (id: number) => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  const expense = await expenseRepo.findOneBy({ id });  // Fetch the expense by ID
  if (!expense) {
    throw new Error('Expense not found');
  }
  return expense;
};

/**
 * Update an existing expense by its ID.
 * @param {string} id - The ID of the expense to be updated.
 * @param {any} data - The data to update the expense with.
 * @returns {Promise<Expense>} The updated expense document.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const updateExpense = async (id: number, data: any) => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  const expense = await expenseRepo.findOneBy({ id });  // Fetch the expense by ID
  if (!expense) {
    throw new Error('Expense not found');
  }
  expenseRepo.merge(expense, data);  // Merge the data into the existing expense
  return expenseRepo.save(expense);  // Save the updated expense
};

/**
 * Delete an expense by its ID.
 * @param {string} id - The ID of the expense to be deleted.
 * @returns {Promise<Expense>} The deleted expense document.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const deleteExpense = async (id: number) => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  const expense = await expenseRepo.findOneBy({ id });  // Fetch the expense by ID
  if (!expense) {
    throw new Error('Expense not found');
  }
  await expenseRepo.delete(id);  // Delete the expense from the database
  return expense;  // Return the deleted expense
};

/**
 * Get expenses aggregated by category within a specified date range.
 * @param {string} startDate - The start date of the date range.
 * @param {string} endDate - The end date of the date range.
 * @returns {Promise<any[]>} A list of aggregated expenses by category within the specified date range.
 */
export const getExpensesByCategory = async (
  startDate: string,
  endDate: string
) => {
  const start = moment(startDate).startOf('day').toDate();
  const end = moment(endDate).endOf('day').toDate();

  const expenseRepo = AppDataSource.getRepository(Expense);
  
  // Aggregating expenses by category within the date range
  const expenses = await expenseRepo
    .createQueryBuilder('expense')
    .select('expense.category')
    .addSelect('SUM(expense.amount)', 'totalAmount')
    .addSelect('COUNT(expense.id)', 'count')
    .where('expense.date BETWEEN :startDate AND :endDate', { startDate: start, endDate: end })
    .groupBy('expense.category')
    .orderBy('totalAmount', 'DESC')
    .getRawMany();

  return expenses;
};

/**
 * Get expenses by a specific category within a given date range.
 * @param {string} category - The category of expenses to be retrieved.
 * @param {Date} startDate - The start date of the date range.
 * @param {Date} endDate - The end date of the date range.
 * @returns {Promise<Expense[]>} A list of expenses within the category and date range.
 */
export const getExpensesByCategoryAndDateRange = async (
  category: string,
  startDate: Date,
  endDate: Date
) => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  return expenseRepo.find({
    where: {
      category,
      date: Between(startDate, endDate)
    }
  });
};

/**
 * Generate spending suggestions using AI based on spending trends.
 * @param {Object[]} trends - An array of spending trends, each with a month and totalAmount.
 * @param {number} trends.month - The month of the trend.
 * @param {number} trends.totalAmount - The total amount spent in that month.
 * @returns {Promise<string>} The AI-generated spending suggestions.
 * @throws {Error} Throws an error if AI suggestion generation fails.
 */
const generateSuggestionsWithAI = async (
  trends: { month: number; totalAmount: number }[]
) => {
  const trendDescriptions = trends
    .map((trend) => {
      return `Month: ${trend.month}, Amount spent: ${trend.totalAmount}`;
    })
    .join(', ');

  const prompt = `
    You are a financial assistant. Given the following spending trends, provide clear and concise spending suggestions:
    ${trendDescriptions}
    `;

  try {
    const apiKey = process.env.GEMINI_API_KEY ?? ''; // Fallback to empty string if undefined
    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    return text;
  } catch (error) {
    console.error('Error generating suggestions from AI:', error);
    return 'Unable to generate suggestions at the moment.';
  }
};

/**
 * Get spending trends for a particular category within a date range and generate AI-based suggestions.
 * @param {string} category - The category for which spending trends are to be retrieved.
 * @param {Date} startDate - The start date of the date range.
 * @param {Date} endDate - The end date of the date range.
 * @returns {Promise<{ trends: { month: number; totalAmount: number }[], suggestions: string }>}
 * A response containing the spending trends and AI-generated suggestions.
 */
export const getSpendingTrendsWithAI = async (
  category: string,
  startDate: Date,
  endDate: Date
) => {
  const expenseRepo = AppDataSource.getRepository(Expense);
  const expenses = await expenseRepo
    .createQueryBuilder('expense')
    .select('MONTH(expense.date)', 'month')
    .addSelect('SUM(expense.amount)', 'totalAmount')
    .where('expense.category = :category', { category })
    .andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate })
    .groupBy('month')
    .orderBy('month', 'ASC')
    .getRawMany();

  const validTrends = expenses.map((trend:any) => ({
    month: trend.month,
    totalAmount: trend.totalAmount,
  }));

  // Generate suggestions using Google Generative AI
  const aiSuggestions = await generateSuggestionsWithAI(validTrends);

  return {
    trends: validTrends,
    suggestions: aiSuggestions,
  };
};
