import React, { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { ExpenseItem } from "../components/budget/ExpenseItem";
import { BudgetSummary } from "../components/dashboard/BudgetSummary";
import { BudgetCategoryForm } from "../components/budget/BudgetCategoryForm";
import { ExpenseForm } from "../components/budget/ExpenseForm";
import { Dialog, DialogContent } from "../components/ui/Dialog";
import { getEvents, getBudgetCategories, getExpenses } from "../lib/api";
import type { Event, Budget, BudgetCategory, Expense } from "../types";
import { supabase } from "../lib/supabase";

export const BudgetPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadBudgetData();
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
      if (eventsData.length > 0) {
        setSelectedEvent(eventsData[0].id);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const loadBudgetData = async () => {
    try {
      const [categoriesData, expensesData] = await Promise.all([
        getBudgetCategories(selectedEvent),
        getExpenses(selectedEvent),
      ]);

      const totalBudget = categoriesData.reduce(
        (sum, cat) => sum + cat.allocated,
        0
      );
      setBudget({
        id: selectedEvent,
        eventId: selectedEvent,
        totalBudget,
        categories: categoriesData,
      });
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
  };

  // Filter expenses based on category and search query
  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (!budget) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget & Expenses</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingCategory(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button onClick={() => setIsAddingExpense(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogContent>
            <BudgetCategoryForm
              eventId={selectedEvent}
              onSuccess={() => {
                setIsAddingCategory(false);
                loadBudgetData();
              }}
              onCancel={() => setIsAddingCategory(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogContent>
            <ExpenseForm
              eventId={selectedEvent}
              onSuccess={() => {
                setIsAddingExpense(false);
                loadBudgetData();
              }}
              onCancel={() => setIsAddingExpense(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BudgetSummary budget={budget} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  label="Select Event"
                  options={events.map((event) => ({
                    value: event.id,
                    label: event.title,
                  }))}
                  value={selectedEvent}
                  onChange={setSelectedEvent}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>% Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.categories.map((category) => {
                    const remaining = category.allocated - category.spent;
                    const percentUsed = Math.round(
                      (category.spent / category.allocated) * 100
                    );

                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium capitalize">
                          {category.name}
                        </TableCell>
                        <TableCell>
                          ${category.allocated.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹{category.spent.toLocaleString()}
                        </TableCell>
                        <TableCell>₹{remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                percentUsed > 90
                                  ? "bg-error-500"
                                  : percentUsed > 75
                                  ? "bg-warning-500"
                                  : "bg-success-500"
                              }`}
                              style={{ width: `${percentUsed}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {percentUsed}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "venue", label: "Venue" },
                    { value: "catering", label: "Catering" },
                    { value: "marketing", label: "Marketing" },
                    { value: "staff", label: "Staff" },
                    { value: "other", label: "Other" },
                  ]}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
              </div>
              <Button variant="outline" className="flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))
              ) : (
                <TableRow>
                  <TableHead colSpan={6} className="text-center py-4">
                    No expenses found. Try adjusting your filters.
                  </TableHead>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
