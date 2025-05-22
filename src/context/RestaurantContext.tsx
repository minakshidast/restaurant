import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  Table, 
  Staff, 
  Order,
  Ingredient,
  MenuItemIngredient,
  PurchaseOrder,
  PurchaseOrderItem,
  Customer,
  CustomerFeedback,
  RestaurantWebsite,
  BusinessHour,
  SocialLinks,
  CustomerReview,
  LoyaltyPoints,
  LoyaltyTransaction,
  VisitorStats
} from "../types/models";
import { 
  restaurants as initialRestaurants, 
  menuCategories as initialMenuCategories, 
  menuItems as initialMenuItems, 
  tables as initialTables, 
  staff as initialStaff, 
  orders as initialOrders 
} from "../data/mockData";

// Default initial website settings
const defaultWebsiteSettings: RestaurantWebsite = {
  theme: 'light',
  primaryColor: '#9b87f5',
  description: '',
  address: '',
  phoneNumber: '',
  email: '',
  businessHours: [
    { day: 'monday', open: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'tuesday', open: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'wednesday', open: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'thursday', open: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'friday', open: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'saturday', open: true, openTime: '10:00', closeTime: '22:00' },
    { day: 'sunday', open: true, openTime: '10:00', closeTime: '20:00' },
  ],
  galleryImages: [],
  socialLinks: {},
  showMap: true,
  showReviews: true,
  whatsappEnabled: false,
  loyaltyEnabled: false,
  pointsPerOrder: 10,
  reviewsRequireApproval: true,
  analyticsEnabled: false,
  visitorStats: {
    totalVisits: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    topItems: [],
    lastUpdated: new Date()
  }
};

interface RestaurantContextType {
  // Current restaurant state
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  
  // Restaurant management
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Omit<Restaurant, "id" | "createdAt">) => Restaurant;
  
  // Menu categories
  menuCategories: MenuCategory[];
  addMenuCategory: (category: Omit<MenuCategory, "id" | "createdAt">) => void;
  updateMenuCategory: (categoryId: string, data: Partial<MenuCategory>) => void;
  deleteMenuCategory: (categoryId: string) => void;
  
  // Menu items
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id" | "createdAt">) => void;
  updateMenuItem: (itemId: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  
  // Tables
  tables: Table[];
  addTable: (table: Omit<Table, "id" | "createdAt">) => void;
  updateTable: (tableId: string, data: Partial<Table>) => void;
  deleteTable: (tableId: string) => void;
  
  // Staff
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, "id" | "createdAt">) => void;
  updateStaff: (staffId: string, data: Partial<Staff>) => void;
  deleteStaff: (staffId: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  
  // Inventory Management
  ingredients: Ingredient[];
  menuItemIngredients: MenuItemIngredient[];
  addIngredient: (ingredient: Omit<Ingredient, "id" | "createdAt">) => void;
  updateIngredient: (ingredientId: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (ingredientId: string) => void;
  linkIngredientToMenuItem: (menuItemId: string, ingredientId: string, quantity: number) => void;
  unlinkIngredientFromMenuItem: (menuItemId: string, ingredientId: string) => void;
  updateMenuItemIngredient: (menuItemId: string, ingredientId: string, quantity: number) => void;
  deductIngredientsFromStock: (orderId: string) => void;
  getLowStockIngredients: () => Ingredient[];
  
  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  purchaseOrderItems: PurchaseOrderItem[];
  addPurchaseOrder: (order: Omit<PurchaseOrder, "id" | "createdAt">) => void;
  updatePurchaseOrder: (orderId: string, data: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (orderId: string) => void;
  addPurchaseOrderItem: (item: Omit<PurchaseOrderItem, "id">) => void;
  updatePurchaseOrderItem: (itemId: string, data: Partial<PurchaseOrderItem>) => void;
  deletePurchaseOrderItem: (itemId: string) => void;
  receivePurchaseOrder: (orderId: string) => void;
  
  // CRM Functions
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  updateCustomer: (customerId: string, data: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;
  addCustomerFeedback: (feedback: Omit<CustomerFeedback, "id" | "createdAt">) => void;
  getCustomerFeedback: (customerId: string) => CustomerFeedback[];

  // Website Management
  updateWebsiteSettings: (restaurantId: string, settings: Partial<RestaurantWebsite>) => void;
  uploadImage: (restaurantId: string, imageType: 'logo' | 'banner' | 'gallery', imageUrl: string) => void;
  removeGalleryImage: (restaurantId: string, imageUrl: string) => void;
  updateBusinessHours: (restaurantId: string, businessHours: BusinessHour[]) => void;
  updateSocialLinks: (restaurantId: string, socialLinks: SocialLinks) => void;

  // New Advanced Features
  // Reviews
  customerReviews: CustomerReview[];
  addCustomerReview: (review: Omit<CustomerReview, "id" | "createdAt">) => void;
  approveCustomerReview: (reviewId: string) => void;
  deleteCustomerReview: (reviewId: string) => void;
  getRestaurantReviews: (restaurantId: string) => CustomerReview[];
  
  // Loyalty Points
  loyaltyPoints: LoyaltyPoints[];
  loyaltyTransactions: LoyaltyTransaction[];
  addLoyaltyPoints: (customerId: string, restaurantId: string, points: number, orderId?: string) => void;
  redeemLoyaltyPoints: (customerId: string, restaurantId: string, points: number) => boolean;
  getCustomerLoyaltyPoints: (customerId: string, restaurantId: string) => number;
  getLoyaltyTransactions: (customerId: string, restaurantId: string) => LoyaltyTransaction[];
  
  // Visitor Tracking
  recordPageVisit: (restaurantId: string, isUnique: boolean, itemViewed?: string) => void;
  updateVisitorStats: (restaurantId: string, stats: Partial<VisitorStats>) => void;
  
  // Menu Promotions
  toggleItemPromotion: (itemId: string, isPromoted: boolean, tag?: string) => void;
  toggleItemBestseller: (itemId: string, isBestseller: boolean) => void;
  
  // QR Code Data
  getQrCodeUrl: (restaurantId: string) => string;
  getQrCodeWithLogo: (restaurantId: string) => string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize restaurants with default website settings
  const initialRestaurantsWithWebsite = initialRestaurants.map(restaurant => ({
    ...restaurant,
    website: defaultWebsiteSettings
  }));

  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(initialRestaurantsWithWebsite[0]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurantsWithWebsite);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(initialMenuCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Inventory Management State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [menuItemIngredients, setMenuItemIngredients] = useState<MenuItemIngredient[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  
  // CRM State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerFeedback, setCustomerFeedback] = useState<CustomerFeedback[]>([]);

  // New states for advanced features
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints[]>([]);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([]);

  // Restaurant management
  const addRestaurant = (restaurantData: Omit<Restaurant, "id" | "createdAt">) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: `rest${restaurants.length + 1}`,
      createdAt: new Date(),
      website: defaultWebsiteSettings,
    };
    setRestaurants([...restaurants, newRestaurant]);
    return newRestaurant;
  };

  // Menu categories
  const addMenuCategory = (categoryData: Omit<MenuCategory, "id" | "createdAt">) => {
    const newCategory: MenuCategory = {
      ...categoryData,
      id: `cat${menuCategories.length + 1}`,
      createdAt: new Date(),
    };
    setMenuCategories([...menuCategories, newCategory]);
  };

  const updateMenuCategory = (categoryId: string, data: Partial<MenuCategory>) => {
    setMenuCategories(
      menuCategories.map((category) =>
        category.id === categoryId ? { ...category, ...data } : category
      )
    );
  };

  const deleteMenuCategory = (categoryId: string) => {
    setMenuCategories(menuCategories.filter((category) => category.id !== categoryId));
    // Also delete associated menu items
    setMenuItems(menuItems.filter((item) => item.categoryId !== categoryId));
  };

  // Menu items
  const addMenuItem = (itemData: Omit<MenuItem, "id" | "createdAt">) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item${menuItems.length + 1}`,
      createdAt: new Date(),
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (itemId: string, data: Partial<MenuItem>) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, ...data } : item
      )
    );
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  // Tables
  const addTable = (tableData: Omit<Table, "id" | "createdAt">) => {
    const newTable: Table = {
      ...tableData,
      id: `table${tables.length + 1}`,
      createdAt: new Date(),
    };
    setTables([...tables, newTable]);
  };

  const updateTable = (tableId: string, data: Partial<Table>) => {
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, ...data } : table
      )
    );
  };

  const deleteTable = (tableId: string) => {
    setTables(tables.filter((table) => table.id !== tableId));
  };

  // Staff
  const addStaff = (staffData: Omit<Staff, "id" | "createdAt">) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff${staff.length + 1}`,
      createdAt: new Date(),
    };
    setStaff([...staff, newStaff]);
  };

  const updateStaff = (staffId: string, data: Partial<Staff>) => {
    setStaff(
      staff.map((staffMember) =>
        staffMember.id === staffId ? { ...staffMember, ...data } : staffMember
      )
    );
  };

  const deleteStaff = (staffId: string) => {
    setStaff(staff.filter((staffMember) => staffMember.id !== staffId));
  };

  // Orders
  const addOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `order${orders.length + 1}`,
      createdAt: new Date(),
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // Inventory Management Functions
  const addIngredient = (ingredientData: Omit<Ingredient, "id" | "createdAt">) => {
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: `ingr${ingredients.length + 1}`,
      createdAt: new Date(),
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (ingredientId: string, data: Partial<Ingredient>) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === ingredientId ? { ...ingredient, ...data } : ingredient
      )
    );
  };

  const deleteIngredient = (ingredientId: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== ingredientId));
    
    // Also remove any menu item ingredient relationships
    setMenuItemIngredients(
      menuItemIngredients.filter((link) => link.ingredientId !== ingredientId)
    );
  };

  const linkIngredientToMenuItem = (menuItemId: string, ingredientId: string, quantity: number) => {
    // Check if relationship already exists
    const existingLink = menuItemIngredients.find(
      (link) => link.menuItemId === menuItemId && link.ingredientId === ingredientId
    );

    if (existingLink) {
      // Update existing relationship
      setMenuItemIngredients(
        menuItemIngredients.map((link) =>
          link.menuItemId === menuItemId && link.ingredientId === ingredientId
            ? { ...link, quantity }
            : link
        )
      );
    } else {
      // Create new relationship
      setMenuItemIngredients([
        ...menuItemIngredients,
        { menuItemId, ingredientId, quantity },
      ]);
    }
  };

  const unlinkIngredientFromMenuItem = (menuItemId: string, ingredientId: string) => {
    setMenuItemIngredients(
      menuItemIngredients.filter(
        (link) => !(link.menuItemId === menuItemId && link.ingredientId === ingredientId)
      )
    );
  };

  const updateMenuItemIngredient = (menuItemId: string, ingredientId: string, quantity: number) => {
    setMenuItemIngredients(
      menuItemIngredients.map((link) =>
        link.menuItemId === menuItemId && link.ingredientId === ingredientId
          ? { ...link, quantity }
          : link
      )
    );
  };

  const deductIngredientsFromStock = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Get all menu items in the order
    const orderMenuItems = order.items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    }));

    // For each menu item, find its ingredients and deduct from stock
    const updatedIngredients = [...ingredients];

    orderMenuItems.forEach((orderItem) => {
      const itemIngredients = menuItemIngredients.filter(
        (link) => link.menuItemId === orderItem.menuItemId
      );

      itemIngredients.forEach((ingredient) => {
        const ingredientIndex = updatedIngredients.findIndex(
          (i) => i.id === ingredient.ingredientId
        );

        if (ingredientIndex >= 0) {
          const totalDeduction = ingredient.quantity * orderItem.quantity;
          updatedIngredients[ingredientIndex] = {
            ...updatedIngredients[ingredientIndex],
            stockQuantity: Math.max(
              0,
              updatedIngredients[ingredientIndex].stockQuantity - totalDeduction
            ),
          };
        }
      });
    });

    setIngredients(updatedIngredients);
  };

  const getLowStockIngredients = () => {
    return ingredients.filter(
      (ingredient) => ingredient.stockQuantity <= ingredient.lowStockThreshold
    );
  };

  // Purchase Order Functions
  const addPurchaseOrder = (orderData: Omit<PurchaseOrder, "id" | "createdAt">) => {
    const newOrder: PurchaseOrder = {
      ...orderData,
      id: `po${purchaseOrders.length + 1}`,
      createdAt: new Date(),
    };
    setPurchaseOrders([...purchaseOrders, newOrder]);
  };

  const updatePurchaseOrder = (orderId: string, data: Partial<PurchaseOrder>) => {
    setPurchaseOrders(
      purchaseOrders.map((order) =>
        order.id === orderId ? { ...order, ...data } : order
      )
    );
  };

  const deletePurchaseOrder = (orderId: string) => {
    setPurchaseOrders(purchaseOrders.filter((order) => order.id !== orderId));
    
    // Also remove any order items
    setPurchaseOrderItems(
      purchaseOrderItems.filter((item) => item.purchaseOrderId !== orderId)
    );
  };

  const addPurchaseOrderItem = (itemData: Omit<PurchaseOrderItem, "id">) => {
    const newItem: PurchaseOrderItem = {
      ...itemData,
      id: `poi${purchaseOrderItems.length + 1}`,
    };
    setPurchaseOrderItems([...purchaseOrderItems, newItem]);
  };

  const updatePurchaseOrderItem = (itemId: string, data: Partial<PurchaseOrderItem>) => {
    setPurchaseOrderItems(
      purchaseOrderItems.map((item) =>
        item.id === itemId ? { ...item, ...data } : item
      )
    );
  };

  const deletePurchaseOrderItem = (itemId: string) => {
    setPurchaseOrderItems(purchaseOrderItems.filter((item) => item.id !== itemId));
  };

  const receivePurchaseOrder = (orderId: string) => {
    // Update order status
    updatePurchaseOrder(orderId, { status: "delivered", deliveryDate: new Date() });
    
    // Update stock levels
    const orderItems = purchaseOrderItems.filter(
      (item) => item.purchaseOrderId === orderId
    );
    
    const updatedIngredients = [...ingredients];
    
    orderItems.forEach((item) => {
      const ingredientIndex = updatedIngredients.findIndex(
        (i) => i.id === item.ingredientId
      );
      
      if (ingredientIndex >= 0) {
        updatedIngredients[ingredientIndex] = {
          ...updatedIngredients[ingredientIndex],
          stockQuantity: updatedIngredients[ingredientIndex].stockQuantity + item.quantity,
        };
      }
    });
    
    setIngredients(updatedIngredients);
  };

  // CRM Functions
  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust${customers.length + 1}`,
      createdAt: new Date(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (customerId: string, data: Partial<Customer>) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId ? { ...customer, ...data } : customer
      )
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  const addCustomerFeedback = (feedbackData: Omit<CustomerFeedback, "id" | "createdAt">) => {
    const newFeedback: CustomerFeedback = {
      ...feedbackData,
      id: `feedback${customerFeedback.length + 1}`,
      createdAt: new Date(),
    };
    setCustomerFeedback([...customerFeedback, newFeedback]);
  };

  const getCustomerFeedback = (customerId: string) => {
    return customerFeedback.filter((feedback) => feedback.customerId === customerId);
  };

  // Website Management Functions
  const updateWebsiteSettings = (restaurantId: string, settings: Partial<RestaurantWebsite>) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              ...settings,
            },
          };
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being edited
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          ...settings,
        },
      });
    }
  };

  const uploadImage = (restaurantId: string, imageType: 'logo' | 'banner' | 'gallery', imageUrl: string) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          if (imageType === 'logo') {
            return {
              ...restaurant,
              website: {
                ...restaurant.website,
                logoUrl: imageUrl,
              },
            };
          } else if (imageType === 'banner') {
            return {
              ...restaurant,
              website: {
                ...restaurant.website,
                bannerUrl: imageUrl,
              },
            };
          } else if (imageType === 'gallery') {
            return {
              ...restaurant,
              website: {
                ...restaurant.website,
                galleryImages: [...(restaurant.website?.galleryImages || []), imageUrl],
              },
            };
          }
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being edited
    if (currentRestaurant?.id === restaurantId) {
      if (imageType === 'logo') {
        setCurrentRestaurant({
          ...currentRestaurant,
          website: {
            ...currentRestaurant.website,
            logoUrl: imageUrl,
          },
        });
      } else if (imageType === 'banner') {
        setCurrentRestaurant({
          ...currentRestaurant,
          website: {
            ...currentRestaurant.website,
            bannerUrl: imageUrl,
          },
        });
      } else if (imageType === 'gallery') {
        setCurrentRestaurant({
          ...currentRestaurant,
          website: {
            ...currentRestaurant.website,
            galleryImages: [...(currentRestaurant.website?.galleryImages || []), imageUrl],
          },
        });
      }
    }
  };

  const removeGalleryImage = (restaurantId: string, imageUrl: string) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              galleryImages: (restaurant.website?.galleryImages || []).filter(
                (url) => url !== imageUrl
              ),
            },
          };
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being edited
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          galleryImages: (currentRestaurant.website?.galleryImages || []).filter(
            (url) => url !== imageUrl
          ),
        },
      });
    }
  };

  const updateBusinessHours = (restaurantId: string, businessHours: BusinessHour[]) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              businessHours,
            },
          };
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being edited
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          businessHours,
        },
      });
    }
  };

  const updateSocialLinks = (restaurantId: string, socialLinks: SocialLinks) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              socialLinks,
            },
          };
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being edited
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          socialLinks,
        },
      });
    }
  };

  // New Advanced Feature Functions
  
  // Customer Reviews Functions
  const addCustomerReview = (reviewData: Omit<CustomerReview, "id" | "createdAt">) => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `review${customerReviews.length + 1}`,
      createdAt: new Date(),
    };
    setCustomerReviews([...customerReviews, newReview]);
  };

  const approveCustomerReview = (reviewId: string) => {
    setCustomerReviews(
      customerReviews.map((review) =>
        review.id === reviewId ? { ...review, isApproved: true } : review
      )
    );
  };

  const deleteCustomerReview = (reviewId: string) => {
    setCustomerReviews(customerReviews.filter((review) => review.id !== reviewId));
  };

  const getRestaurantReviews = (restaurantId: string) => {
    return customerReviews.filter((review) => review.restaurantId === restaurantId);
  };

  // Loyalty Points Functions
  const addLoyaltyPoints = (
    customerId: string, 
    restaurantId: string, 
    points: number, 
    orderId?: string
  ) => {
    // First check if customer already has loyalty points for this restaurant
    const existingLoyalty = loyaltyPoints.find(
      (lp) => lp.customerId === customerId && lp.restaurantId === restaurantId
    );

    if (existingLoyalty) {
      // Update existing points
      setLoyaltyPoints(
        loyaltyPoints.map((lp) =>
          lp.customerId === customerId && lp.restaurantId === restaurantId
            ? { ...lp, points: lp.points + points }
            : lp
        )
      );
    } else {
      // Create new loyalty points entry
      const newLoyaltyPoints: LoyaltyPoints = {
        id: `lp${loyaltyPoints.length + 1}`,
        customerId,
        restaurantId,
        points,
        createdAt: new Date(),
      };
      setLoyaltyPoints([...loyaltyPoints, newLoyaltyPoints]);
    }

    // Record transaction
    const newTransaction: LoyaltyTransaction = {
      id: `lt${loyaltyTransactions.length + 1}`,
      customerId,
      restaurantId,
      points,
      type: 'earned',
      orderId,
      createdAt: new Date(),
    };
    setLoyaltyTransactions([...loyaltyTransactions, newTransaction]);
  };

  const redeemLoyaltyPoints = (
    customerId: string, 
    restaurantId: string, 
    points: number
  ): boolean => {
    // Check if customer has enough points
    const existingLoyalty = loyaltyPoints.find(
      (lp) => lp.customerId === customerId && lp.restaurantId === restaurantId
    );

    if (!existingLoyalty || existingLoyalty.points < points) {
      return false; // Not enough points
    }

    // Update points
    setLoyaltyPoints(
      loyaltyPoints.map((lp) =>
        lp.customerId === customerId && lp.restaurantId === restaurantId
          ? { ...lp, points: lp.points - points }
          : lp
      )
    );

    // Record transaction
    const newTransaction: LoyaltyTransaction = {
      id: `lt${loyaltyTransactions.length + 1}`,
      customerId,
      restaurantId,
      points,
      type: 'redeemed',
      createdAt: new Date(),
    };
    setLoyaltyTransactions([...loyaltyTransactions, newTransaction]);

    return true; // Successfully redeemed
  };

  const getCustomerLoyaltyPoints = (customerId: string, restaurantId: string): number => {
    const loyalty = loyaltyPoints.find(
      (lp) => lp.customerId === customerId && lp.restaurantId === restaurantId
    );
    return loyalty ? loyalty.points : 0;
  };

  const getLoyaltyTransactions = (customerId: string, restaurantId: string) => {
    return loyaltyTransactions.filter(
      (lt) => lt.customerId === customerId && lt.restaurantId === restaurantId
    );
  };

  // Visitor Tracking Functions
  const recordPageVisit = (restaurantId: string, isUnique: boolean, itemViewed?: string) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId && restaurant.website) {
          const stats = restaurant.website.visitorStats || {
            totalVisits: 0,
            uniqueVisitors: 0,
            averageTimeOnPage: 0,
            topItems: [],
            lastUpdated: new Date()
          };
          
          // Update stats
          const newStats = {
            ...stats,
            totalVisits: stats.totalVisits + 1,
            uniqueVisitors: isUnique ? stats.uniqueVisitors + 1 : stats.uniqueVisitors,
            lastUpdated: new Date()
          };
          
          // Update top items if an item was viewed
          if (itemViewed) {
            const existingItem = newStats.topItems.find(item => item.itemId === itemViewed);
            if (existingItem) {
              existingItem.views += 1;
            } else {
              newStats.topItems.push({ itemId: itemViewed, views: 1 });
            }
            // Sort by views
            newStats.topItems.sort((a, b) => b.views - a.views);
            // Cap at top 10 items
            if (newStats.topItems.length > 10) {
              newStats.topItems = newStats.topItems.slice(0, 10);
            }
          }
          
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              visitorStats: newStats
            }
          };
        }
        return restaurant;
      })
    );
    
    // Also update currentRestaurant if it's the one being tracked
    if (currentRestaurant?.id === restaurantId && currentRestaurant.website) {
      const stats = currentRestaurant.website.visitorStats || {
        totalVisits: 0,
        uniqueVisitors: 0,
        averageTimeOnPage: 0,
        topItems: [],
        lastUpdated: new Date()
      };
      
      const newStats = {
        ...stats,
        totalVisits: stats.totalVisits + 1,
        uniqueVisitors: isUnique ? stats.uniqueVisitors + 1 : stats.uniqueVisitors,
        lastUpdated: new Date()
      };
      
      if (itemViewed) {
        const existingItem = newStats.topItems.find(item => item.itemId === itemViewed);
        if (existingItem) {
          existingItem.views += 1;
        } else {
          newStats.topItems.push({ itemId: itemViewed, views: 1 });
        }
        newStats.topItems.sort((a, b) => b.views - a.views);
        if (newStats.topItems.length > 10) {
          newStats.topItems = newStats.topItems.slice(0, 10);
        }
      }
      
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          visitorStats: newStats
        }
      });
    }
  };

  const updateVisitorStats = (restaurantId: string, stats: Partial<VisitorStats>) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === restaurantId && restaurant.website) {
          return {
            ...restaurant,
            website: {
              ...restaurant.website,
              visitorStats: {
                ...restaurant.website.visitorStats,
                ...stats,
                lastUpdated: new Date()
              }
            }
          };
        }
        return restaurant;
      })
    );
    
    if (currentRestaurant?.id === restaurantId && currentRestaurant.website) {
      setCurrentRestaurant({
        ...currentRestaurant,
        website: {
          ...currentRestaurant.website,
          visitorStats: {
            ...currentRestaurant.website.visitorStats,
            ...stats,
            lastUpdated: new Date()
          }
        }
      });
    }
  };
  
  // Menu Promotions Functions
  const toggleItemPromotion = (itemId: string, isPromoted: boolean, tag?: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId
          ? { ...item, isPromoted, promotionTag: isPromoted ? (tag || "Special") : undefined }
          : item
      )
    );
  };
  
  const toggleItemBestseller = (itemId: string, isBestseller: boolean) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, isBestseller } : item
      )
    );
  };
  
  // QR Code Functions
  const getQrCodeUrl = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? `https://${restaurant.slug}.platform.com` : "";
  };
  
  const getQrCodeWithLogo = (restaurantId: string) => {
    // In real implementation, this would generate a QR code with the restaurant logo
    // For now, just return the URL
    return getQrCodeUrl(restaurantId);
  };

  const value: RestaurantContextType = {
    currentRestaurant,
    setCurrentRestaurant,
    restaurants,
    addRestaurant,
    menuCategories,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    tables,
    addTable,
    updateTable,
    deleteTable,
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
    orders,
    addOrder,
    updateOrderStatus,
    
    ingredients,
    menuItemIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    linkIngredientToMenuItem,
    unlinkIngredientFromMenuItem,
    updateMenuItemIngredient,
    deductIngredientsFromStock,
    getLowStockIngredients,
    
    purchaseOrders,
    purchaseOrderItems,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    addPurchaseOrderItem,
    updatePurchaseOrderItem,
    deletePurchaseOrderItem,
    receivePurchaseOrder,
    
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addCustomerFeedback,
    getCustomerFeedback,
    
    updateWebsiteSettings,
    uploadImage,
    removeGalleryImage,
    updateBusinessHours,
    updateSocialLinks,
    
    customerReviews,
    addCustomerReview,
    approveCustomerReview,
    deleteCustomerReview,
    getRestaurantReviews,
    
    loyaltyPoints,
    loyaltyTransactions,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    getCustomerLoyaltyPoints,
    getLoyaltyTransactions,
    
    recordPageVisit,
    updateVisitorStats,
    
    toggleItemPromotion,
    toggleItemBestseller,
    
    getQrCodeUrl,
    getQrCodeWithLogo,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurantContext must be used within a RestaurantProvider");
  }
  return context;
};
