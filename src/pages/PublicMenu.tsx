
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/formatting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QrCode, Phone } from "lucide-react";

const PublicMenu: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { restaurants, menuCategories, menuItems } = useRestaurantContext();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  
  // Find the restaurant by slug
  const restaurant = restaurants.find((r) => r.slug === slug);
  
  // If restaurant not found, redirect to home
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Restaurant Not Found</CardTitle>
            <CardDescription>
              The restaurant you're looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Get categories and items for this restaurant
  const restaurantCategories = menuCategories
    .filter((category) => category.restaurantId === restaurant.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
    
  const restaurantItems = menuItems.filter(
    (item) => item.restaurantId === restaurant.id && item.isAvailable
  );
  
  // Group items by category
  const itemsByCategory = restaurantCategories.map((category) => {
    const items = restaurantItems.filter((item) => item.categoryId === category.id);
    return {
      ...category,
      items,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground mt-2">Menu</p>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Our Menu</h2>
            <p className="text-muted-foreground">
              Browse our selection of delicious food and drinks
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <Phone size={16} className="mr-2" /> Call to Order
            </Button>
            
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center">
                  <QrCode size={16} className="mr-2" /> Scan to Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan QR Code to Order</DialogTitle>
                  <DialogDescription>
                    Scan this QR code with your phone camera to place an order.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex justify-center py-6">
                  <div className="bg-white p-4 rounded-md">
                    {/* Placeholder for QR Code */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode size={120} />
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  Or visit:{" "}
                  <a href={`https://bistro-hub.com/order/${slug}`} className="text-primary">
                    bistro-hub.com/order/{slug}
                  </a>
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      
        {/* Category Tabs */}
        {restaurantCategories.length > 0 ? (
          <Tabs defaultValue={restaurantCategories[0]?.id}>
            <TabsList className="w-full flex overflow-x-auto max-w-full mb-6">
              {restaurantCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1 whitespace-nowrap min-w-fit"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {itemsByCategory.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.length > 0 ? (
                    category.items.map((item) => (
                      <div key={item.id} className="border rounded-md overflow-hidden flex flex-col md:flex-row">
                        {item.imageUrl && (
                          <div className="w-full md:w-1/3 bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-medium text-green-600">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No items in this category</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">This restaurant has no menu items yet.</p>
          </div>
        )}
      </main>
      
      <footer className="border-t bg-card mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="font-bold">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Bistro Hub
              </p>
            </div>
            
            <Button size="sm" className="mt-4 md:mt-0" onClick={() => setQrDialogOpen(true)}>
              Order Now
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;
