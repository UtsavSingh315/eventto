import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { EventCard } from '../components/dashboard/EventCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import type { Event } from '../types';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            budget_categories (*)
          `);

        if (error) {
          throw error;
        }

        // Transform the data to match our Event type
        const transformedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          startDate: event.start_date,
          endDate: event.end_date,
          location: event.location,
          status: event.status,
          coverImageUrl: event.cover_image_url || undefined,
          createdBy: event.created_by,
          budget: {
            id: event.id,
            eventId: event.id,
            totalBudget: event.budget_categories?.reduce((sum: number, cat: any) => sum + cat.allocated, 0) || 0,
            categories: event.budget_categories?.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              allocated: cat.allocated,
              spent: cat.spent
            })) || []
          }
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Link to="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'canceled', label: 'Canceled' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No events found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};