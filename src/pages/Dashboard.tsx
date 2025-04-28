import React, { useState, useEffect } from "react";
import { Calendar, Users, Package, DollarSign } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { EventCard } from "../components/dashboard/EventCard";
import { BudgetSummary } from "../components/dashboard/BudgetSummary";
import { supabase } from "../lib/supabase";
import type { Event } from "../types";

export const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    totalVendors: 0,
    totalExpenses: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events with budget categories
        const { data: eventsData, error: eventsError } = await supabase.from(
          "events"
        ).select(`
            *,
            budget_categories (*)
          `);

        if (eventsError) throw eventsError;

        // Transform events data
        const transformedEvents = eventsData.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description || "",
          startDate: event.start_date,
          endDate: event.end_date,
          location: event.location,
          status: event.status,
          coverImageUrl: event.cover_image_url || undefined,
          createdBy: event.created_by,
          budget: {
            id: event.id,
            eventId: event.id,
            totalBudget:
              event.budget_categories?.reduce(
                (sum: number, cat: any) => sum + cat.allocated,
                0
              ) || 0,
            categories:
              event.budget_categories?.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                allocated: cat.allocated,
                spent: cat.spent,
              })) || [],
          },
        }));

        setEvents(transformedEvents);

        // Fetch dashboard stats
        const [
          { count: attendeesCount },
          { count: vendorsCount },
          { data: expensesData },
        ] = await Promise.all([
          supabase
            .from("attendees")
            .select("*", { count: "exact", head: true }),
          supabase.from("vendors").select("*", { count: "exact", head: true }),
          supabase.from("expenses").select("amount"),
        ]);

        const totalExpenses =
          expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

        setStats({
          totalEvents: eventsData.length,
          totalAttendees: attendeesCount || 0,
          totalVendors: vendorsCount || 0,
          totalExpenses,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  // Use first event's budget for the budget summary if available
  const budgetData = events[0]?.budget;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to eventto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">
                Total Events
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalEvents}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total Attendees
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalAttendees}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-accent-600">
                Total Vendors
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalVendors}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warning-50 border border-warning-100">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center mr-4">
              <DollarSign className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-warning-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalExpenses.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 4).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
          {budgetData ? (
            <BudgetSummary budget={budgetData} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No budget data available
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
