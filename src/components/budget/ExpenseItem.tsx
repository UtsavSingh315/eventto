import React from "react";
import { format } from "date-fns";
import { Expense } from "../../types";
import { Badge } from "../ui/Badge";
import { TableRow, TableCell } from "../ui/Table";
import { formatCurrency } from "../../utils/formatCurrency";

interface ExpenseItemProps {
  expense: Expense;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  return (
    <TableRow>
      <TableCell>{expense.description}</TableCell>
      <TableCell className="capitalize">{expense.category}</TableCell>
      <TableCell>{formatCurrency(expense.amount)}</TableCell>
      <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
    </TableRow>
  );
};
