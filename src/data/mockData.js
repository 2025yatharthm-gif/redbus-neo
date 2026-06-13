/**
 * mockData.js — Phase 5.2 expanded city and route database
 */

export const POPULAR_ROUTES = [
  { id: 'r1',  from: 'Mumbai',    to: 'Pune',       duration: '3h 30m', price: 299  },
  { id: 'r2',  from: 'Mumbai',    to: 'Goa',        duration: '8h 30m', price: 799  },
  { id: 'r3',  from: 'Delhi',     to: 'Jaipur',     duration: '5h 00m', price: 549  },
  { id: 'r4',  from: 'Delhi',     to: 'Agra',       duration: '3h 30m', price: 399  },
  { id: 'r5',  from: 'Bengaluru', to: 'Chennai',    duration: '6h 30m', price: 649  },
  { id: 'r6',  from: 'Hyderabad', to: 'Bengaluru',  duration: '9h 30m', price: 849  },
  { id: 'r7',  from: 'Mumbai',    to: 'Ahmedabad',  duration: '7h 30m', price: 699  },
  { id: 'r8',  from: 'Bengaluru', to: 'Mysore',     duration: '3h 00m', price: 349  },
  { id: 'r9',  from: 'Chennai',   to: 'Madurai',    duration: '8h 00m', price: 599  },
  { id: 'r10', from: 'Delhi',     to: 'Chandigarh', duration: '4h 30m', price: 449  },
  { id: 'r11', from: 'Pune',      to: 'Goa',        duration: '7h 00m', price: 699  },
  { id: 'r12', from: 'Hyderabad', to: 'Chennai',    duration: '8h 30m', price: 749  },
]

// 35 cities across India
export const CITIES = [
  // Maharashtra
  'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur',
  // Gujarat
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
  // Delhi NCR
  'Delhi', 'Noida', 'Gurgaon',
  // Rajasthan
  'Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Ajmer',
  // Punjab & Haryana
  'Chandigarh', 'Amritsar', 'Ludhiana',
  // Uttarakhand
  'Dehradun',
  // Uttar Pradesh
  'Agra', 'Lucknow', 'Varanasi',
  // Karnataka
  'Bengaluru', 'Mysore', 'Hubli', 'Mangalore',
  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Tirupati',
  // Telangana & Andhra Pradesh
  'Hyderabad', 'Warangal', 'Vijayawada',
  // Goa
  'Goa',
]
