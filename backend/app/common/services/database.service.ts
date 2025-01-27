import { DataSource } from "typeorm";
import { Expense } from "../../expenses/expenses.schema";
import { Budget } from "../../budget/budget.schema";
import { User } from "../../user/user.schema";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "",
  port: parseInt(process.env.DB_PORT || "5433", 10), // Changed default port to 5432 (PostgreSQL default)
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "user",
  database: process.env.DB_DATABASE ?? "test5",
  entities: [Expense, Budget, User], // Make sure these schemas are correct and exported
  synchronize: true, // Use migrations for production
  migrations: ["app/migrations/*.ts"], // Ensure the path matches your migration files
});

export const initDB = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    if (
      !process.env.DB_HOST ||
      !process.env.DB_USERNAME ||
      !process.env.DB_PASSWORD ||
      !process.env.DB_DATABASE
    ) {
      console.error("Database configuration is incomplete.");
      throw new Error("Database configuration is incomplete. Check your environment variables.");
    }
    AppDataSource.initialize()
      .then(() => {
        console.log("Database connected successfully!");
        resolve(true);
      })
      .catch((error) => {
        console.error("Error connecting to the database:", error.message);
        reject(error);
      });
  });
};
