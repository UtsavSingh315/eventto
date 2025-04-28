import React, { useState } from 'react';
import { Event } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';

interface EventFormProps {
  event?: Partial<Event>;
  onSubmit: (eventData: Partial<Event>) => void;
  isLoading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: '',
      description: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      location: '',
      status: 'draft',
      coverImageUrl: ''
    }
  );

  const handleChange = (field: keyof Event, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="datetime-local"
              value={formData.startDate ? formData.startDate.toString().slice(0, 16) : ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />

            <Input
              label="End Date"
              type="datetime-local"
              value={formData.endDate ? formData.endDate.toString().slice(0, 16) : ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />

          <Select
            label="Status"
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'canceled', label: 'Canceled' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
            required
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="cover-image" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image URL
            </label>
            <Input
              id="cover-image"
              value={formData.coverImageUrl || ''}
              onChange={(e) => handleChange('coverImageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" isLoading={isLoading}>
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};