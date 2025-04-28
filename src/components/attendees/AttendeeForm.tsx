import React, { useState, useEffect } from "react";
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
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

interface AttendeeFormProps {
  eventId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AttendeeForm: React.FC<AttendeeFormProps> = ({
  eventId,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>(
    []
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticketType: "standard",
    eventId: eventId || "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch events");
        return;
      }

      setEvents(data || []);
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: attendeeError } = await supabase.from("attendees").insert({
        event_id: formData.eventId,
        name: formData.name,
        email: formData.email,
        status: "registered",
        ticket_type: formData.ticketType,
      });

      if (attendeeError) throw attendeeError;

      toast.success("Attendee added successfully");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding attendee:", error);
      toast.error(error.message || "Failed to add attendee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Attendee</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!eventId && (
            <Select
              label="Event"
              options={events.map((event) => ({
                value: event.id,
                label: event.title,
              }))}
              value={formData.eventId}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, eventId: value }))
              }
              required
            />
          )}

          <Input
            label="Attendee Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <Input
            type="email"
            label="Attendee Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <Select
            label="Ticket Type"
            options={[
              { value: "standard", label: "Standard" },
              { value: "vip", label: "VIP" },
              { value: "early-bird", label: "Early Bird" },
            ]}
            value={formData.ticketType}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, ticketType: value }))
            }
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Attendee
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
