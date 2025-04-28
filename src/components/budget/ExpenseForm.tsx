import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { createExpense } from "../../lib/api";
import toast from "react-hot-toast";
import type { Database } from "../../lib/database.types";
import { supabase } from "../../lib/supabase";
type Tables = Database["public"]["Tables"];

interface ExpenseFormProps {
  eventId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  eventId,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<Tables["expenses"]["Insert"], "id" | "created_at">
  >({
    event_id: eventId,
    category: "venue",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createExpense(formData);
      // Update the spent field in the budget_categories table
      const { error: updateError } = await supabase
        .from("budget_categories")
        .update({ spent: formData.amount })
        .eq("event_id", formData.event_id)
        .eq("name", formData.category);

      if (updateError) throw updateError;

      toast.success("Expense added successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Select
            label="Category"
            options={[
              { value: "venue", label: "Venue" },
              { value: "catering", label: "Catering" },
              { value: "marketing", label: "Marketing" },
              { value: "staff", label: "Staff" },
              { value: "other", label: "Other" },
            ]}
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                category: value as Tables["expenses"]["Insert"]["category"],
              }))
            }
            required
          />

          <Input
            type="number"
            label="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value),
              }))
            }
            min={0}
            required
          />

          <Input
            type="text"
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />

          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Expense
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
