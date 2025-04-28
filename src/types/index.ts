// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "attendee";
  avatarUrl?: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "draft" | "published" | "canceled" | "completed";
  coverImageUrl?: string;
  createdBy: string;
  budget: Budget;
}

// Budget and expense types
export interface Budget {
  id: string;
  eventId: string;
  totalBudget: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: "venue" | "catering" | "marketing" | "staff" | "other";
  allocated: number;
  spent: number;
}

export interface Expense {
  id: string;
  eventId: string;
  category: "venue" | "catering" | "marketing" | "staff" | "other";
  amount: number;
  description: string;
  date: string;
  vendorId?: string;
  receipt?: string;
  status: "pending" | "approved" | "rejected";
}

// Vendor types
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category:
    | "venue"
    | "catering"
    | "marketing"
    | "entertainment"
    | "technology"
    | "other";
  address?: string;
  website?: string;
  notes?: string;
}

// Attendee types
export interface Attendee {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
  status: "registered" | "attended" | "canceled" | "no-show";
  ticketType?: string;
  checkInTime?: string;
}

// Guest types
export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  invitedBy: string;
  status: "invited" | "confirmed" | "declined" | "attended";
  plusOne: boolean;
}
