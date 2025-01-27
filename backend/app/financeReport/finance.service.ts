import { Expense } from '../expenses/expenses.schema';
import { Budget } from '../budget/budget.schema';
import { AppDataSource } from '../common/services/database.service'; // Import AppDataSource to access your TypeORM repositories
import PDFDocument from 'pdfkit';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

/**
 * Generates a financial report PDF based on the specified date range and category.
 * @param {Date} startDate - The start date of the date range.
 * @param {Date} endDate - The end date of the date range.
 * @param {string} category - The category to generate the report for.
 * @param {Response} res - The response object to stream the generated report to the client.
 * @returns {Promise<void>} Returns a promise that resolves when the report has been sent.
 */
const generateFinancialReportPDF = async (
  startDate: Date,
  endDate: Date,
  category: string,
  res: any
) => {
  try {
    const expenseRepo = AppDataSource.getRepository(Expense);
    const expenses = await expenseRepo.createQueryBuilder("expense")
      .select("SUM(expense.amount)", "totalExpenses")
      .addSelect("COUNT(expense.id)", "expenseCount")
      .where("expense.date BETWEEN :startDate AND :endDate", { startDate, endDate })
      .andWhere("expense.category = :category", { category })
      .getRawOne(); 
    const totalExpenses = expenses.totalExpenses || 0;
    const expenseCount = expenses.expenseCount || 0;
    const budgetRepo = AppDataSource.getRepository(Budget);
    const budget = await budgetRepo.findOne({
      where: {
        category,
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
      },
    });
    const budgetAmount = budget?.amount ?? 0;
    const budgetVariance = totalExpenses - budgetAmount;
    const suggestions = [];
    if (budgetVariance > 0) suggestions.push(`You exceeded your budget by $${budgetVariance.toFixed(2)}.`);
    else if (budgetVariance < 0) suggestions.push(`You saved $${Math.abs(budgetVariance).toFixed(2)}.`);
    else suggestions.push(`You stayed on budget.`);
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Disposition', `attachment; filename="financial_report.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    // Title
    doc.fontSize(20).text('Financial Report', { align: 'center' }).moveDown(2);
    // Date Range and Category
    doc.fontSize(14).text(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    doc.text(`Category: ${category}`).moveDown(2);
    // Expenses Overview
    doc.fontSize(16).text('Expenses Overview', { underline: true }).moveDown();
    doc.fontSize(12).text(`Total Expenses: $${totalExpenses.toFixed(2)}`);
    doc.text(`Number of Transactions: ${expenseCount}`).moveDown(2);
    // Budget Overview
    doc.fontSize(16).text('Budget Overview', { underline: true }).moveDown();
    doc.fontSize(12).text(`Budget Amount: $${Number(budgetAmount).toFixed(2)}`);
    doc.text(`Budget Variance: $${Number(budgetVariance).toFixed(2)}`).moveDown(2);
    // Suggestions
    doc.fontSize(16).text('Suggestions', { underline: true }).moveDown();
    suggestions.forEach((suggestion, index) => {
      doc.fontSize(12).text(`${index + 1}. ${suggestion}`);
    });
    // Footer
    doc.moveDown(3).fontSize(10).text('Generated on ' + new Date().toLocaleString(), {
      align: 'center',
    });
    doc.end();  
  } catch (error) {
    console.error("Error generating the financial report:", error);
    res.status(500).json({ message: "Error generating the financial report." });
  }
};

export { generateFinancialReportPDF };
