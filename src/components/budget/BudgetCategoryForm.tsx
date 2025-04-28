import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface BudgetCategoryFormProps {
  eventId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BudgetCategoryForm: React.FC<BudgetCategoryFormProps> = ({
  eventId,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'venue',
    allocated: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('budget_categories')
        .insert({
          event_id: eventId,
          name: formData.name,
          allocated: formData.allocated,
          spent: 0
        });

      if (error) throw error;

      toast.success('Budget category added successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding budget category:', error);
      toast.error('Failed to add budget category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Budget Category</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Select
            label="Category"
            options={[
              { value: 'venue', label: 'Venue' },
              { value: 'catering', label: 'Catering' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'staff', label: 'Staff' },
              { value: 'other', label: 'Other' },
            ]}
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />

          <Input
            type="number"
            label="Allocated Budget"
            value={formData.allocated}
            onChange={(e) => setFormData(prev => ({ ...prev, allocated: parseFloat(e.target.value) }))}
            min={0}
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Category
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};