export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  address: string;
}

export const mockOrders: Order[] = [
  {
    id: 'EB-10042',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah@example.com',
    items: [
      { productName: 'Ethiopian Yirgacheffe', quantity: 2, price: 22.50 },
      { productName: 'Morning Ritual Blend', quantity: 1, price: 16.50 }
    ],
    total: 61.50,
    status: 'pending',
    date: '2026-01-15',
    address: '42 Maple St, Portland, OR 97201'
  },
  {
    id: 'EB-10041',
    customerName: 'Marcus Johnson',
    customerEmail: 'marcus@example.com',
    items: [
      { productName: 'Artisan Espresso Blend', quantity: 3, price: 18.50 }
    ],
    total: 55.50,
    status: 'processing',
    date: '2026-01-14',
    address: '188 Oak Ave, Seattle, WA 98101'
  },
  {
    id: 'EB-10040',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily@example.com',
    items: [
      { productName: 'Kenya AA Nyeri', quantity: 1, price: 26.00 },
      { productName: 'Sumatra Mandheling', quantity: 2, price: 24.00 }
    ],
    total: 74.00,
    status: 'shipped',
    date: '2026-01-13',
    address: '77 Pine Rd, San Francisco, CA 94102'
  },
  {
    id: 'EB-10039',
    customerName: 'David Kim',
    customerEmail: 'david@example.com',
    items: [
      { productName: 'Colombian Supremo', quantity: 2, price: 19.00 }
    ],
    total: 38.00,
    status: 'delivered',
    date: '2026-01-12',
    address: '305 Elm Blvd, Denver, CO 80201'
  },
  {
    id: 'EB-10038',
    customerName: 'Lisa Thompson',
    customerEmail: 'lisa@example.com',
    items: [
      { productName: 'Ethiopian Yirgacheffe', quantity: 1, price: 22.50 },
      { productName: 'Artisan Espresso Blend', quantity: 1, price: 18.50 },
      { productName: 'Morning Ritual Blend', quantity: 2, price: 16.50 }
    ],
    total: 74.00,
    status: 'delivered',
    date: '2026-01-11',
    address: '12 Cedar Ln, Austin, TX 73301'
  },
  {
    id: 'EB-10037',
    customerName: 'James Wilson',
    customerEmail: 'james@example.com',
    items: [
      { productName: 'Sumatra Mandheling', quantity: 1, price: 24.00 }
    ],
    total: 24.00,
    status: 'delivered',
    date: '2026-01-10',
    address: '89 Birch Way, Chicago, IL 60601'
  }
];

export const weeklySales = [
  { day: 'Mon', revenue: 245, orders: 8 },
  { day: 'Tue', revenue: 312, orders: 11 },
  { day: 'Wed', revenue: 198, orders: 6 },
  { day: 'Thu', revenue: 420, orders: 14 },
  { day: 'Fri', revenue: 380, orders: 12 },
  { day: 'Sat', revenue: 520, orders: 18 },
  { day: 'Sun', revenue: 290, orders: 9 }
];

export const monthlyRevenue = [
  { month: 'Aug', revenue: 4200 },
  { month: 'Sep', revenue: 5100 },
  { month: 'Oct', revenue: 4800 },
  { month: 'Nov', revenue: 6200 },
  { month: 'Dec', revenue: 7800 },
  { month: 'Jan', revenue: 5400 }
];

export const topProducts = [
  { name: 'Ethiopian Yirgacheffe', sold: 142, revenue: 3195 },
  { name: 'Artisan Espresso Blend', sold: 128, revenue: 2368 },
  { name: 'Morning Ritual Blend', sold: 115, revenue: 1898 },
  { name: 'Colombian Supremo', sold: 98, revenue: 1862 },
  { name: 'Kenya AA Nyeri', sold: 76, revenue: 1976 },
  { name: 'Sumatra Mandheling', sold: 64, revenue: 1536 }
];
