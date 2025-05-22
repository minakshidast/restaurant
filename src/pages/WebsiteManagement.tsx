import React, { useState } from "react";
import { useRestaurantContext } from "../context/RestaurantContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ExternalLink, Globe, Eye } from "lucide-react";

// Import new components
import { QrCodeGenerator } from "@/components/website/QrCodeGenerator";
import { WhatsAppSettings } from "@/components/restaurant/WhatsAppSettings";
import { LoyaltySettings } from "@/components/restaurant/LoyaltySettings";
import { AnalyticsSettings } from "@/components/restaurant/AnalyticsSettings";
import { MenuPromotionSettings } from "@/components/restaurant/MenuPromotionSettings";

const WebsiteManagement: React.FC = () => {
  const { currentRestaurant, updateWebsiteSettings, menuItems } = useRestaurantContext();

  // Ensure currentRestaurant exists
  if (!currentRestaurant) {
    return <DashboardLayout title="Website Management">No restaurant selected</DashboardLayout>;
  }

  // Initialize website settings
  const websiteSettings = currentRestaurant.website || {
    theme: 'light',
    primaryColor: '#F97300',  // Updated to the bright orange color
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    businessHours: [],
    galleryImages: [],
    socialLinks: {},
    showMap: true,
    showReviews: true,
    whatsappEnabled: false,
    loyaltyEnabled: false,
    pointsPerOrder: 10,
    reviewsRequireApproval: true,
    analyticsEnabled: false,
  };

  // State for form
  const [theme, setTheme] = useState<'light' | 'dark'>(
    websiteSettings.theme || 'light'
  );
  const [primaryColor, setPrimaryColor] = useState(
    websiteSettings.primaryColor || '#F97300'  // Updated to the bright orange color
  );
  const [description, setDescription] = useState(websiteSettings.description || '');
  const [address, setAddress] = useState(websiteSettings.address || '');
  const [phoneNumber, setPhoneNumber] = useState(
    websiteSettings.phoneNumber || ''
  );
  const [email, setEmail] = useState(websiteSettings.email || '');
  const [showMap, setShowMap] = useState(websiteSettings.showMap !== false);
  const [showReviews, setShowReviews] = useState(websiteSettings.showReviews !== false);
  const [reviewsRequireApproval, setReviewsRequireApproval] = useState(
    websiteSettings.reviewsRequireApproval !== false
  );

  // Handle form submission
  const handleSaveSettings = () => {
    updateWebsiteSettings(currentRestaurant.id, {
      theme,
      primaryColor,
      description,
      address,
      phoneNumber,
      email,
      showMap,
      showReviews,
      reviewsRequireApproval,
    });
    toast({
      title: "Settings Updated",
      description: "Your website settings have been saved.",
    });
  };

  const handleWhatsAppSettingsUpdate = (settings: {
    whatsappEnabled: boolean;
    whatsappNumber?: string;
    whatsappGreeting?: string;
  }) => {
    updateWebsiteSettings(currentRestaurant.id, settings);
    toast({
      title: "WhatsApp Settings Updated",
      description: "Your WhatsApp integration settings have been saved.",
    });
  };

  const handleLoyaltySettingsUpdate = (settings: {
    loyaltyEnabled: boolean;
    pointsPerOrder?: number;
  }) => {
    updateWebsiteSettings(currentRestaurant.id, settings);
    toast({
      title: "Loyalty Settings Updated",
      description: "Your loyalty program settings have been saved.",
    });
  };

  const handleAnalyticsSettingsUpdate = (settings: {
    analyticsEnabled: boolean;
    analyticsCode?: string;
  }) => {
    updateWebsiteSettings(currentRestaurant.id, settings);
    toast({
      title: "Analytics Settings Updated",
      description: "Your analytics tracking settings have been saved.",
    });
  };

  // Generate restaurant URL for QR code
  const restaurantUrl = `https://${currentRestaurant.slug}.platform.com`;
  
  // Create a subdomain preview URL
  const previewSubdomainUrl = `/${currentRestaurant.slug}`;

  return (
    <DashboardLayout title="Website Management">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Website Management</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={previewSubdomainUrl} target="_blank" rel="noopener noreferrer">
                <Eye size={16} className="mr-2" />
                Preview Website
              </Link>
            </Button>
            <Button asChild>
              <a 
                href={restaurantUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Visit Live Website
              </a>
            </Button>
          </div>
        </div>
        
        <Card className="mb-8 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Globe size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Your Restaurant Website</h2>
                <p className="text-sm text-muted-foreground">
                  Your restaurant's public website is available at{" "}
                  <a 
                    href={restaurantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {restaurantUrl}
                  </a>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updates to your website settings will be reflected on your public site automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Basic Settings</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty & Rewards</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="promotions">Menu Promotions</TabsTrigger>
          </TabsList>

          {/* Basic Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>
                  Customize the appearance and content of your restaurant's website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme & Colors */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Theme & Colors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="theme-select" className="block mb-2">
                        Website Theme
                      </Label>
                      <select
                        id="theme-select"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="primary-color" className="block mb-2">
                        Primary Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          id="primary-color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Content</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description" className="block mb-2">
                        Restaurant Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell customers about your restaurant..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="block mb-2">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, City, State, ZIP"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="block mb-2">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="(123) 456-7890"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="block mb-2">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@restaurant.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Display Options</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-map" className="cursor-pointer">
                        Show Map
                      </Label>
                      <Switch
                        id="show-map"
                        checked={showMap}
                        onCheckedChange={setShowMap}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-reviews" className="cursor-pointer">
                        Show Customer Reviews
                      </Label>
                      <Switch
                        id="show-reviews"
                        checked={showReviews}
                        onCheckedChange={setShowReviews}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>
                  Generate a QR code for your restaurant's menu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QrCodeGenerator 
                  restaurantName={currentRestaurant.name}
                  restaurantUrl={restaurantUrl}
                  logoUrl={websiteSettings.logoUrl}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews Management</CardTitle>
                <CardDescription>
                  Configure settings for customer reviews on your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reviews-approval" className="block font-medium">
                      Require Approval for Reviews
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      When enabled, new reviews will be hidden until you approve them
                    </p>
                  </div>
                  <Switch
                    id="reviews-approval"
                    checked={reviewsRequireApproval}
                    onCheckedChange={setReviewsRequireApproval}
                  />
                </div>

                <Button onClick={handleSaveSettings}>Save Review Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program</CardTitle>
                <CardDescription>
                  Configure a loyalty program for your customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoyaltySettings 
                  isEnabled={!!websiteSettings.loyaltyEnabled}
                  pointsPerOrder={websiteSettings.pointsPerOrder || 10}
                  onUpdate={handleLoyaltySettingsUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>
                  Add a WhatsApp button to your restaurant website for direct customer communication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppSettings 
                  isEnabled={!!websiteSettings.whatsappEnabled}
                  whatsappNumber={websiteSettings.whatsappNumber || ''}
                  whatsappGreeting={websiteSettings.whatsappGreeting || ''}
                  onUpdate={handleWhatsAppSettingsUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Integration</CardTitle>
                <CardDescription>
                  Track visitor activity on your restaurant website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsSettings 
                  isEnabled={!!websiteSettings.analyticsEnabled}
                  analyticsCode={websiteSettings.analyticsCode}
                  onUpdate={handleAnalyticsSettingsUpdate}
                />
                
                {websiteSettings.visitorStats && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium mb-4">Basic Visit Analytics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-muted/30 p-4 rounded-md text-center">
                        <div className="text-3xl font-bold">
                          {websiteSettings.visitorStats.totalVisits}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Page Views
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-md text-center">
                        <div className="text-3xl font-bold">
                          {websiteSettings.visitorStats.uniqueVisitors}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Unique Visitors
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-md text-center">
                        <div className="text-3xl font-bold">
                          {websiteSettings.visitorStats.topItems?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Menu Items Viewed
                        </div>
                      </div>
                    </div>
                    
                    {websiteSettings.visitorStats.topItems?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Most Viewed Menu Items</h4>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="py-2 px-4 text-left">Item</th>
                                <th className="py-2 px-4 text-right">Views</th>
                              </tr>
                            </thead>
                            <tbody>
                              {websiteSettings.visitorStats.topItems.map((item, index) => {
                                const menuItem = menuItems.find(mi => mi.id === item.itemId);
                                
                                return (
                                  <tr key={item.itemId} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                                    <td className="py-2 px-4">{menuItem?.name || item.itemId}</td>
                                    <td className="py-2 px-4 text-right">{item.views}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Menu Promotions Tab */}
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Menu Promotions</CardTitle>
                <CardDescription>
                  Highlight specials and bestselling items on your menu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuPromotionSettings restaurantId={currentRestaurant.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-muted/30 p-6 rounded-lg border">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Eye size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Website Preview</h2>
              <p className="text-sm text-muted-foreground">
                Preview how your website will appear to customers
              </p>
            </div>
          </div>
          
          <div className="aspect-video w-full border rounded-lg overflow-hidden bg-white shadow-sm">
            <iframe 
              src={previewSubdomainUrl} 
              title="Website Preview" 
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button asChild variant="outline">
              <Link to={previewSubdomainUrl} target="_blank" rel="noopener noreferrer">
                <Eye size={16} className="mr-2" />
                Open Preview in New Tab
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteManagement;
