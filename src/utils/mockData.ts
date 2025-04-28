import { User, Event, Budget, BudgetCategory, Expense, Vendor, Attendee, Guest } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'attendee',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'attendee',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
  },
];

// Mock Budget Categories
export const budgetCategories: BudgetCategory[] = [
  {
    id: 'bc1',
    name: 'venue',
    allocated: 5000,
    spent: 4500,
  },
  {
    id: 'bc2',
    name: 'catering',
    allocated: 3000,
    spent: 2800,
  },
  {
    id: 'bc3',
    name: 'marketing',
    allocated: 2000,
    spent: 1500,
  },
  {
    id: 'bc4',
    name: 'staff',
    allocated: 1500,
    spent: 1200,
  },
  {
    id: 'bc5',
    name: 'other',
    allocated: 1000,
    spent: 600,
  },
];

// Mock Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Annual Tech Conference',
    description: 'A conference for tech enthusiasts and professionals',
    startDate: '2025-06-15T09:00:00Z',
    endDate: '2025-06-17T18:00:00Z',
    location: 'Convention Center, Downtown',
    status: 'published',
    coverImageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
    createdBy: '1',
    budget: {
      id: 'b1',
      eventId: '1',
      totalBudget: 12500,
      categories: budgetCategories,
    },
  },
  {
    id: '2',
    title: 'Product Launch Party',
    description: 'Celebration for the launch of our new product line',
    startDate: '2025-07-20T18:00:00Z',
    endDate: '2025-07-20T22:00:00Z',
    location: 'Grand Ballroom, Luxury Hotel',
    status: 'draft',
    coverImageUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
    createdBy: '1',
    budget: {
      id: 'b2',
      eventId: '2',
      totalBudget: 8000,
      categories: budgetCategories.map(cat => ({ ...cat, allocated: cat.allocated * 0.7, spent: cat.spent * 0.5 })),
    },
  },
  {
    id: '3',
    title: 'Team Building Retreat',
    description: 'A weekend retreat for team bonding and strategic planning',
    startDate: '2025-08-10T08:00:00Z',
    endDate: '2025-08-12T17:00:00Z',
    location: 'Mountain Resort',
    status: 'published',
    coverImageUrl: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
    createdBy: '1',
    budget: {
      id: 'b3',
      eventId: '3',
      totalBudget: 15000,
      categories: budgetCategories.map(cat => ({ ...cat, allocated: cat.allocated * 1.2, spent: cat.spent * 0.8 })),
    },
  },
];

// Mock Expenses
export const expenses: Expense[] = [
  {
    id: 'e1',
    eventId: '1',
    category: 'venue',
    amount: 4500,
    description: 'Venue rental fee',
    date: '2025-05-20T14:00:00Z',
    vendorId: 'v1',
    receipt: 'receipt1.pdf',
    status: 'approved',
  },
  {
    id: 'e2',
    eventId: '1',
    category: 'catering',
    amount: 2800,
    description: 'Catering services for 200 people',
    date: '2025-05-25T11:30:00Z',
    vendorId: 'v2',
    receipt: 'receipt2.pdf',
    status: 'approved',
  },
  {
    id: 'e3',
    eventId: '1',
    category: 'marketing',
    amount: 1500,
    description: 'Social media campaign',
    date: '2025-05-10T09:15:00Z',
    vendorId: 'v3',
    receipt: 'receipt3.pdf',
    status: 'approved',
  },
];

// Mock Vendors
export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Grand Convention Center',
    email: 'bookings@grandconvention.com',
    phone: '123-456-7890',
    category: 'venue',
    address: '123 Main St, Downtown',
    website: 'www.grandconvention.com',
    notes: 'Preferred venue for large events',
  },
  {
    id: 'v2',
    name: 'Gourmet Catering Co.',
    email: 'info@gourmetcatering.com',
    phone: '234-567-8901',
    category: 'catering',
    address: '456 Food Ave, Culinary District',
    website: 'www.gourmetcatering.com',
    notes: 'Excellent for corporate events',
  },
  {
    id: 'v3',
    name: 'MediaBoost Marketing',
    email: 'campaigns@mediaboost.com',
    phone: '345-678-9012',
    category: 'marketing',
    address: '789 Digital Blvd, Media Center',
    website: 'www.mediaboost.com',
    notes: 'Specializes in event promotion',
  },
];

// Mock Attendees
export const attendees: Attendee[] = [
  {
    id: 'a1',
    userId: '2',
    eventId: '1',
    registrationDate: '2025-05-01T10:20:00Z',
    status: 'registered',
    ticketType: 'VIP',
  },
  {
    id: 'a2',
    userId: '3',
    eventId: '1',
    registrationDate: '2025-05-03T14:45:00Z',
    status: 'registered',
    ticketType: 'Standard',
  },
];

// Mock Guests
export const guests: Guest[] = [
  {
    id: 'g1',
    eventId: '1',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '456-789-0123',
    invitedBy: '1',
    status: 'confirmed',
    plusOne: true,
  },
  {
    id: 'g2',
    eventId: '1',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    phone: '567-890-1234',
    invitedBy: '1',
    status: 'invited',
    plusOne: false,
  },
];

// Current User (for auth simulation)
export const currentUser: User = users[0]; // Default as admin