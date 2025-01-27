import React from "react";
import { useGetAllExpensesQuery } from "../../services/api";

const Expenses = () => {
  const { data, isLoading, error } = useGetAllExpensesQuery();
  console.log(data);
  // Simulate an error for testing

  if (isLoading) return <div>Loading expenses...</div>;
  if (error)  throw new Error("Simulated error: Data is missing!");
  ;
// utils/delay.ts

  return (
    <div>
      <h1>All Expenses</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>

    </div>
  );
};

export default Expenses;
