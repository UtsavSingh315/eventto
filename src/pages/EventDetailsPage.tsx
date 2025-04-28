import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "../components/ui/Dialog";
import { AttendeeForm } from "../components/attendees/AttendeeForm";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { BudgetSummary } from "../components/dashboard/BudgetSummary";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { supabase } from "../lib/supabase";
import type { Event } from "../types";
import toast from "react-hot-toast";

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "details" | "budget" | "attendees"
  >("details");
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Fetch event with budget categories
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(
            `
            *,
            budget_categories (*)
          `
          )
          .eq("id", id)
          .single();

        if (eventError) throw eventError;

        // Transform event data
        const transformedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description || "",
          startDate: eventData.start_date,
          endDate: eventData.end_date,
          location: eventData.location,
          status: eventData.status,
          coverImageUrl: eventData.cover_image_url || undefined,
          createdBy: eventData.created_by,
          budget: {
            id: eventData.id,
            eventId: eventData.id,
            totalBudget:
              eventData.budget_categories?.reduce(
                (sum: number, cat: any) => sum + cat.allocated,
                0
              ) || 0,
            categories:
              eventData.budget_categories?.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                allocated: cat.allocated,
                spent: cat.spent,
              })) || [],
          },
        };

        setEvent(transformedEvent);

        // Fetch attendees with user details
        const { data: attendeesData, error: attendeesError } = await supabase
          .from("attendees")
          .select(
            `
            *
          `
          )
          .eq("event_id", id);

        if (attendeesError) throw attendeesError;
        setAttendees(attendeesData);

        // Fetch guests
        const { data: guestsData, error: guestsError } = await supabase
          .from("guests")
          .select(
            `
            *,
            inviter:users (
              name
            )
          `
          )
          .eq("event_id", id);

        if (guestsError) throw guestsError;
        setGuests(guestsData);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleDeleteClick = async () => {
    if (!event || !confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast.success("Event deleted successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="text-gray-500 mt-2">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/events">
          <Button className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadgeVariant = () => {
    switch (event.status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "canceled":
        return "error";
      case "completed":
        return "secondary";
      default:
        return "primary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <Badge variant={getStatusBadgeVariant()} className="capitalize">
              {event.status}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">{event.description}</p>
        </div>

        <div className="flex gap-2">
          <Link to={`/events/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-error-600 hover:bg-error-50"
            onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {event.coverImageUrl && (
        <div className="aspect-[3/1] w-full overflow-hidden rounded-lg">
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "details"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}>
            Details
          </button>
          <button
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "budget"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("budget")}>
            Budget
          </button>
          <button
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === "attendees"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("attendees")}>
            Attendees & Guests
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Date & Time
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.startDate), "MMMM d, yyyy")} at{" "}
                      {format(new Date(event.startDate), "h:mm a")} to{" "}
                      {format(new Date(event.endDate), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Location
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Duration
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.round(
                        (new Date(event.endDate).getTime() -
                          new Date(event.startDate).getTime()) /
                          (1000 * 60 * 60)
                      )}{" "}
                      hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Participants
                    </p>
                    <p className="text-sm text-gray-500">
                      {attendees.length} attendees, {guests.length} guests
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total Budget
                    </p>
                    <p className="text-sm text-gray-500">
                      ${event.budget.totalBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Attendees
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
                {event.status === "draft" && (
                  <Button className="w-full justify-start" variant="secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    Publish Event
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="space-y-6">
            <BudgetSummary budget={event.budget} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Budget Categories</span>
                  <Button size="sm">Add Category</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    {event.budget.categories.map((category) => {
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
                            ${category.spent.toLocaleString()}
                          </TableCell>
                          <TableCell>${remaining.toLocaleString()}</TableCell>
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
        )}

        {activeTab === "attendees" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Attendees</span>
                  <Button size="sm" onClick={() => setIsAddingAttendee(true)}>
                    Add Attendee
                  </Button>

                  <Dialog
                    open={isAddingAttendee}
                    onOpenChange={setIsAddingAttendee}>
                    <DialogContent>
                      <AttendeeForm
                        eventId={id}
                        onSuccess={() => {
                          setIsAddingAttendee(false);
                        }}
                        onCancel={() => setIsAddingAttendee(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">
                          {attendee.name}
                        </TableCell>
                        <TableCell>{attendee.email}</TableCell>
                        <TableCell>
                          {format(
                            new Date(attendee.registration_date),
                            "MMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="primary" className="capitalize">
                            {attendee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-xs text-primary-600 hover:text-primary-700">
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guests</span>
                  <Button size="sm">Invite Guest</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plus One</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">
                          {guest.name}
                        </TableCell>
                        <TableCell>{guest.email}</TableCell>
                        <TableCell>{guest.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              guest.status === "confirmed"
                                ? "success"
                                : guest.status === "declined"
                                ? "error"
                                : guest.status === "attended"
                                ? "secondary"
                                : "warning"
                            }
                            className="capitalize">
                            {guest.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{guest.plus_one ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button className="text-xs text-primary-600 hover:text-primary-700">
                              Edit
                            </button>
                            <button className="text-xs text-error-600 hover:text-error-700">
                              Remove
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
