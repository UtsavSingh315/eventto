import { Plus, Search, Mail, Download } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { Dialog, DialogContent } from "../components/ui/Dialog";
import { AttendeeForm } from "../components/attendees/AttendeeForm";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Tables = Database["public"]["Tables"];
type Attendee = Tables["attendees"]["Row"];
type Event = Tables["events"]["Row"];

export const AttendeesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendeesData, setAttendeesData] = useState<
    (Attendee & { event: Event | null })[]
  >([]);

  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0]?.id || "");
    }
  }, [events]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    setEvents(data);
  };

  const fetchAttendees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attendees")
      .select(`*, event:event_id(*)`);

    if (error) {
      console.error("Error fetching attendees:", error);
      setLoading(false);
      return;
    }

    setAttendeesData(
      data.map((attendee) => ({
        ...attendee,
        event: attendee.event,
      }))
    );
    setLoading(false);
  };

  const filteredAttendees = attendeesData.filter((attendee) => {
    const matchesSearch =
      attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent =
      eventFilter === "all" || attendee.event_id === eventFilter;

    return matchesSearch && matchesEvent;
  });

  const handleAddAttendee = () => {
    if (!selectedEventId) {
      alert("Please select an event first");
      return;
    }
    setIsAddingAttendee(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddAttendee}>
            <Plus className="h-4 w-4 mr-2" />
            Add Attendee
          </Button>

          <Dialog open={isAddingAttendee} onOpenChange={setIsAddingAttendee}>
            <DialogContent>
              <AttendeeForm
                onSuccess={() => setIsAddingAttendee(false)}
                onCancel={() => setIsAddingAttendee(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search attendees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select
            options={[
              { value: "all", label: "All Events" },
              ...events.map((event) => ({
                value: event.id,
                label: event.title,
              })),
            ]}
            value={eventFilter}
            onChange={(value) => {
              setEventFilter(value);
              if (value !== "all") {
                setSelectedEventId(value);
              }
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">
                      {attendee.name || "Unknown"}
                    </TableCell>
                    <TableCell>{attendee.email || "Unknown"}</TableCell>
                    <TableCell>{attendee.event?.title || "Unknown"}</TableCell>
                    <TableCell>
                      {format(
                        new Date(attendee.registration_date),
                        "MMM d, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          attendee.status === "attended"
                            ? "success"
                            : attendee.status === "no-show"
                            ? "error"
                            : attendee.status === "canceled"
                            ? "warning"
                            : "primary"
                        }
                        className="capitalize">
                        {attendee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-xs text-primary-600 hover:text-primary-700">
                          Edit
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-700">
                          Email
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No attendees found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
