import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getStatusBadgeVariant = () => {
    switch (event.status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'canceled':
        return 'error';
      case 'completed':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            <Calendar size={48} />
          </div>
        )}
      </div>
      <CardContent className="flex-1 pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
          <Badge variant={getStatusBadgeVariant()} className="capitalize">
            {event.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
        <div className="text-sm text-gray-500 space-y-1.5">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(event.startDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <Link to={`/events/${event.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};