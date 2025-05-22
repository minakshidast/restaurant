
import { MenuCategory, MenuItem, Order, Restaurant, Staff, Table } from "../types/models";

// Mock Restaurants
export const restaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "Bistro Bella",
    slug: "bistro-bella",
    ownerName: "Isabella Chen",
    ownerEmail: "isabella@bistrobella.com",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "rest2",
    name: "Urban Plate",
    slug: "urban-plate",
    ownerName: "Marcus Johnson",
    ownerEmail: "marcus@urbanplate.com",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "rest3",
    name: "Seaside Grill",
    slug: "seaside-grill",
    ownerName: "Sarah Martinez",
    ownerEmail: "sarah@seasidegrill.com",
    createdAt: new Date("2023-03-10"),
  },
];

// Mock Menu Categories
export const menuCategories: MenuCategory[] = [
  {
    id: "cat1",
    name: "Appetizers",
    restaurantId: "rest1",
    sortOrder: 1,
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "cat2",
    name: "Main Courses",
    restaurantId: "rest1",
    sortOrder: 2,
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "cat3",
    name: "Desserts",
    restaurantId: "rest1",
    sortOrder: 3,
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "cat4",
    name: "Drinks",
    restaurantId: "rest1",
    sortOrder: 4,
    createdAt: new Date("2023-01-20"),
  },
];

// Mock Menu Items
export const menuItems: MenuItem[] = [
  {
    id: "item1",
    name: "Bruschetta",
    description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
    price: 8.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat1",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "item2",
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
    price: 10.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat1",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "item3",
    name: "Pasta Carbonara",
    description: "Spaghetti with creamy sauce, pancetta, and parmesan",
    price: 16.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat2",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "item4",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with lemon butter sauce and vegetables",
    price: 22.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat2",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "item5",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price: 8.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat3",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
  {
    id: "item6",
    name: "Red Wine",
    description: "House selection of red wine, glass",
    price: 7.99,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "cat4",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-25"),
  },
];

// Mock Tables
export const tables: Table[] = [
  {
    id: "table1",
    name: "Table 1",
    seats: 2,
    isAvailable: true,
    restaurantId: "rest1",
    createdAt: new Date("2023-01-18"),
  },
  {
    id: "table2",
    name: "Table 2",
    seats: 4,
    isAvailable: false,
    restaurantId: "rest1",
    createdAt: new Date("2023-01-18"),
  },
  {
    id: "table3",
    name: "Table 3",
    seats: 6,
    isAvailable: true,
    restaurantId: "rest1",
    createdAt: new Date("2023-01-18"),
  },
];

// Mock Staff
export const staff: Staff[] = [
  {
    id: "staff1",
    name: "John Smith",
    role: "Chef",
    email: "john@bistrobella.com",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-16"),
  },
  {
    id: "staff2",
    name: "Maria Garcia",
    role: "Server",
    email: "maria@bistrobella.com",
    restaurantId: "rest1",
    createdAt: new Date("2023-01-17"),
  },
  {
    id: "staff3",
    name: "David Lee",
    role: "Host",
    email: "david@bistrobella.com",
    restaurantId: "rest1",
    createdAt: new Date("2023-02-01"),
  },
];

// Mock Orders
export const orders: Order[] = [
  {
    id: "order1",
    tableId: "table2",
    status: "pending",
    total: 36.97,
    items: [
      {
        id: "oi1",
        menuItemId: "item1",
        menuItemName: "Bruschetta",
        quantity: 1,
        price: 8.99,
        orderId: "order1",
      },
      {
        id: "oi2",
        menuItemId: "item3",
        menuItemName: "Pasta Carbonara",
        quantity: 1,
        price: 16.99,
        orderId: "order1",
      },
      {
        id: "oi3",
        menuItemId: "item6",
        menuItemName: "Red Wine",
        quantity: 1,
        price: 7.99,
        orderId: "order1",
      },
    ],
    restaurantId: "rest1",
    createdAt: new Date("2023-05-01T10:30:00"),
  },
  {
    id: "order2",
    customerName: "Emma Wilson",
    status: "preparing",
    total: 31.98,
    items: [
      {
        id: "oi4",
        menuItemId: "item2",
        menuItemName: "Caprese Salad",
        quantity: 1,
        price: 10.99,
        orderId: "order2",
      },
      {
        id: "oi5",
        menuItemId: "item3",
        menuItemName: "Pasta Carbonara",
        quantity: 1,
        price: 16.99,
        orderId: "order2",
      },
      {
        id: "oi6",
        menuItemId: "item5",
        menuItemName: "Tiramisu",
        quantity: 1,
        price: 8.99,
        orderId: "order2",
      }
    ],
    restaurantId: "rest1",
    createdAt: new Date("2023-05-01T11:15:00"),
  },
  {
    id: "order3",
    tableId: "table3",
    status: "completed",
    total: 53.97,
    items: [
      {
        id: "oi7",
        menuItemId: "item4",
        menuItemName: "Grilled Salmon",
        quantity: 1,
        price: 22.99,
        orderId: "order3",
      },
      {
        id: "oi8",
        menuItemId: "item1",
        menuItemName: "Bruschetta",
        quantity: 2,
        price: 8.99,
        orderId: "order3",
      },
      {
        id: "oi9",
        menuItemId: "item6",
        menuItemName: "Red Wine",
        quantity: 2,
        price: 7.99,
        orderId: "order3",
      },
    ],
    restaurantId: "rest1",
    createdAt: new Date("2023-05-01T12:00:00"),
  },
];
