import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface GuestFormProps {
  eventId: string;
  inviterId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({
  eventId,
  inviterId,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plusOne: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('guests')
        .insert({
          event_id: eventId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          invited_by: inviterId,
          status: 'invited',
          plus_one: formData.plusOne
        });

      if (error) throw error;

      toast.success('Guest invited successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error inviting guest:', error);
      toast.error('Failed to invite guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Guest</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label="Guest Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="plusOne"
              checked={formData.plusOne}
              onChange={(e) => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="plusOne" className="text-sm text-gray-700">
              Allow plus one
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Send Invitation
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};