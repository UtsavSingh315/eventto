import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/events/EventForm';
import { Event } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (eventData: Partial<Event>) => {
    setIsLoading(true);
    try {
      // Create the event
      const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          start_date: new Date(eventData.startDate!).toISOString(),
          end_date: new Date(eventData.endDate!).toISOString(),
          location: eventData.location,
          status: eventData.status,
          cover_image_url: eventData.coverImageUrl,
          created_by: '00000000-0000-0000-0000-000000000000' // Default system user ID
        })
        .select()
        .single();

      if (eventError) {
        throw eventError;
      }

      if (!eventResult) {
        throw new Error('Failed to create event');
      }

      // Create default budget categories
      const defaultCategories = [
        { name: 'venue', allocated: 0, spent: 0 },
        { name: 'catering', allocated: 0, spent: 0 },
        { name: 'marketing', allocated: 0, spent: 0 },
        { name: 'staff', allocated: 0, spent: 0 },
        { name: 'other', allocated: 0, spent: 0 }
      ];

      const { error: budgetError } = await supabase
        .from('budget_categories')
        .insert(
          defaultCategories.map(category => ({
            event_id: eventResult.id,
            name: category.name,
            allocated: category.allocated,
            spent: category.spent
          }))
        );

      if (budgetError) {
        throw budgetError;
      }

      setIsLoading(false);
      toast.success('Event created successfully');
      navigate(`/events/${eventResult.id}`);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};