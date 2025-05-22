
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatSlug } from "../utils/formatting";
import { useRestaurantContext } from "../context/RestaurantContext";
import { useToast } from "@/hooks/use-toast";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { addRestaurant, setCurrentRestaurant } = useRestaurantContext();
  const { toast } = useToast();
  
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate slug from restaurant name
  const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setRestaurantName(name);
    setSlug(formatSlug(name));
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(formatSlug(e.target.value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurantName || !slug || !ownerName || !ownerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new restaurant
      const restaurantData = {
        name: restaurantName,
        slug,
        ownerName,
        ownerEmail,
      };
      
      const newRestaurant = addRestaurant(restaurantData);
      
      // Set current restaurant and navigate to dashboard
      setCurrentRestaurant(newRestaurant);
      
      toast({
        title: "Success",
        description: "Restaurant created successfully",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create restaurant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bistro Hub</h1>
          <p className="text-muted-foreground mt-2">
            Create your restaurant profile to get started
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Restaurant Details</CardTitle>
              <CardDescription>
                Enter information about your restaurant to set up your account.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  value={restaurantName}
                  onChange={handleRestaurantNameChange}
                  placeholder="e.g. Bistro Bella"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Restaurant URL</Label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">
                    bistro-hub.com/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    className="rounded-l-none"
                    placeholder="restaurant-name"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your restaurant's unique URL
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Restaurant"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
