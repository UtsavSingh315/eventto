import { supabase } from "./supabase";
import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

// Users
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// Events
export async function getEvents() {
  const { data, error } = await supabase.from("events").select(`
      *,
      budget_categories(*),
      attendees(count)
    `);

  if (error) throw error;
  return data;
}

export async function getEvent(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      budget_categories(*),
      attendees(*),
      guests(*)
    `
    )
    .eq("id", eventId)
    .single();

  if (error) throw error;
  return data;
}

export async function createEvent(event: Tables["events"]["Insert"]) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  eventId: string,
  event: Tables["events"]["Update"]
) {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) throw error;
}

// Budget Categories
export async function getBudgetCategories(eventId: string) {
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}

export async function createBudgetCategory(
  category: Tables["budget_categories"]["Insert"]
) {
  const { data, error } = await supabase
    .from("budget_categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBudgetCategory(
  categoryId: string,
  category: Tables["budget_categories"]["Update"]
) {
  const { data, error } = await supabase
    .from("budget_categories")
    .update(category)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Expenses
export async function getExpenses(eventId: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
      *
    `
    )
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}

export async function createExpense(expense: Tables["expenses"]["Insert"]) {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(
  expenseId: string,
  expense: Tables["expenses"]["Update"]
) {
  const { data, error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", expenseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Vendors
export async function getVendors() {
  const { data, error } = await supabase.from("vendors").select("*");

  if (error) throw error;
  return data;
}

export async function createVendor(vendor: Tables["vendors"]["Insert"]) {
  const { data, error } = await supabase
    .from("vendors")
    .insert(vendor)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVendor(
  vendorId: string,
  vendor: Tables["vendors"]["Update"]
) {
  const { data, error } = await supabase
    .from("vendors")
    .update(vendor)
    .eq("id", vendorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Attendees
export async function getAttendees(eventId: string) {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}

export async function createAttendee(attendee: Tables["attendees"]["Insert"]) {
  const { data, error } = await supabase
    .from("attendees")
    .insert(attendee)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttendee(
  attendeeId: string,
  attendee: Tables["attendees"]["Update"]
) {
  const { data, error } = await supabase
    .from("attendees")
    .update(attendee)
    .eq("id", attendeeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Guests
export async function getGuests(eventId: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}

export async function createGuest(guest: Tables["guests"]["Insert"]) {
  const { data, error } = await supabase
    .from("guests")
    .insert(guest)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGuest(
  guestId: string,
  guest: Tables["guests"]["Update"]
) {
  const { data, error } = await supabase
    .from("guests")
    .update(guest)
    .eq("id", guestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
// Removed user-related functions to disable authentication
