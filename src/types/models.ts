export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: Date;
  website?: RestaurantWebsite;
}

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  sortOrder: number;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: string;
  restaurantId: string;
  createdAt: Date;
  isPromoted?: boolean;
  promotionTag?: string;
  isBestseller?: boolean;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: Date;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  restaurantId: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  tableId?: string;
  customerName?: string;
  status: 'pending' | 'preparing' | 'completed';
  total: number;
  items: OrderItem[];
  restaurantId: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  orderId: string;
}

// Updated inventory-related models
export interface Ingredient {
  id: string;
  name: string;
  unitType: 'kg' | 'liters' | 'pieces' | 'grams' | 'ml' | 'oz' | 'lbs';
  stockQuantity: number;
  lowStockThreshold: number;
  restaurantId: string;
  cost: number;
  createdAt: Date;
  // Add properties used in InventoryManagement component
  costPerUnit?: number;
  unit?: string;
  supplierId?: string;
}

export interface MenuItemIngredient {
  menuItemId: string;
  ingredientId: string;
  quantity: number;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  orderDate: Date;
  deliveryDate?: Date;
  status: 'pending' | 'delivered' | 'cancelled';
  restaurantId: string;
  total: number;
  createdAt: Date;
  // Add properties used in InventoryManagement component
  expectedDeliveryDate?: Date;
  notes?: string;
  supplierId?: string;
  totalAmount?: number;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  cost: number;
  // Add properties used in InventoryManagement component
  unitPrice?: number;
  unit?: string;
}

// New CRM-related models
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  restaurantId: string;
  marketingOptIn: boolean;
  createdAt: Date;
  lastVisitDate?: Date;
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// New Review-related models
export interface CustomerReview {
  id: string;
  restaurantId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

// New Loyalty-related models
export interface LoyaltyPoints {
  id: string;
  customerId: string;
  restaurantId: string;
  points: number;
  createdAt: Date;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  restaurantId: string;
  points: number;
  type: 'earned' | 'redeemed';
  orderId?: string;
  createdAt: Date;
}

// Website-related models with new features
export interface RestaurantWebsite {
  theme: 'light' | 'dark';
  primaryColor: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  businessHours: BusinessHour[];
  galleryImages: string[];
  socialLinks: SocialLinks;
  showMap: boolean;
  showReviews: boolean;
  // New website features
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  whatsappGreeting?: string;
  loyaltyEnabled: boolean;
  pointsPerOrder?: number;
  reviewsRequireApproval?: boolean;
  analyticsEnabled?: boolean;
  analyticsCode?: string;
  visitorStats?: VisitorStats;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  topItems: {itemId: string, views: number}[];
  lastUpdated: Date;
}

export interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  yelp?: string;
  tripadvisor?: string;
}
