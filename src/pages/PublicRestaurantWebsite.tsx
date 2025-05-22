
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRestaurantContext } from "@/context/RestaurantContext";
import { Restaurant, MenuItem, MenuCategory, CustomerReview } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewStars } from "@/components/restaurant/ReviewStars";
import { CustomerReviewForm } from "@/components/restaurant/CustomerReviewForm";
import { MessageSquare, Star, Mail } from "lucide-react";

const PublicRestaurantWebsite: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    restaurants, 
    menuItems, 
    menuCategories, 
    customerReviews, 
    addCustomerReview,
    recordPageVisit 
  } = useRestaurantContext();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");

  // Find restaurant by slug
  useEffect(() => {
    if (slug) {
      const foundRestaurant = restaurants.find(r => r.slug === slug);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        // Generate a simple visitor ID if not already set
        if (!visitorId) {
          const newVisitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          setVisitorId(newVisitorId);
          localStorage.setItem('visitorId', newVisitorId);
        }
        
        // Record page visit
        recordPageVisit(foundRestaurant.id, !localStorage.getItem('visited-' + foundRestaurant.id));
        localStorage.setItem('visited-' + foundRestaurant.id, 'true');
      }
    }
  }, [slug, restaurants, recordPageVisit, visitorId]);

  // Get the restaurant's menu items and categories
  const restaurantMenuItems = restaurant 
    ? menuItems.filter(item => item.restaurantId === restaurant.id && item.isAvailable)
    : [];
  
  const restaurantMenuCategories = restaurant
    ? menuCategories.filter(cat => cat.restaurantId === restaurant.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  // Get approved reviews if showing reviews is enabled
  const approvedReviews = restaurant && restaurant.website?.showReviews
    ? customerReviews
        .filter(review => 
          review.restaurantId === restaurant.id && 
          (!restaurant.website?.reviewsRequireApproval || review.isApproved)
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : [];

  // Handle menu item click for analytics
  const handleMenuItemClick = (itemId: string) => {
    if (restaurant) {
      recordPageVisit(restaurant.id, false, itemId);
    }
  };

  // Handle review submission
  const handleReviewSubmit = (name: string, email: string | undefined, rating: number, comment: string) => {
    if (restaurant) {
      addCustomerReview({
        restaurantId: restaurant.id,
        customerName: name,
        customerEmail: email,
        rating,
        comment,
        isApproved: !restaurant.website?.reviewsRequireApproval
      });
      return true;
    }
    return false;
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="mb-4">Sorry, we couldn't find the restaurant you're looking for.</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Website settings from the restaurant
  const website = restaurant.website || {
    theme: 'light',
    primaryColor: '#F97300', // Updated to the bright orange color
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    businessHours: [],
    galleryImages: [],
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      yelp: '',
      tripadvisor: ''
    },
    showMap: true,
    showReviews: true,
    whatsappEnabled: false,
    whatsappNumber: '',
    whatsappGreeting: '',
    logoUrl: '',
    bannerUrl: '',
    loyaltyEnabled: false
  };

  // Calculate average rating
  const averageRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length 
    : 0;

  return (
    <div className={`min-h-screen ${website.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header with restaurant branding */}
      <header className="relative">
        {website.bannerUrl ? (
          <div className="h-64 relative">
            <img 
              src={website.bannerUrl}
              alt={`${restaurant.name} banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white p-4">
                {website.logoUrl && (
                  <img 
                    src={website.logoUrl} 
                    alt={restaurant.name} 
                    className="h-24 mx-auto mb-4"
                  />
                )}
                <h1 className="text-4xl font-bold">{restaurant.name}</h1>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="h-64 flex items-center justify-center" 
            style={{ backgroundColor: website.primaryColor }}
          >
            <div className="text-center text-white">
              {website.logoUrl && (
                <img 
                  src={website.logoUrl} 
                  alt={restaurant.name} 
                  className="h-24 mx-auto mb-4"
                />
              )}
              <h1 className="text-4xl font-bold">{restaurant.name}</h1>
            </div>
          </div>
        )}

        {/* WhatsApp button */}
        {website.whatsappEnabled && website.whatsappNumber && (
          <a 
            href={`https://wa.me/${website.whatsappNumber}?text=${encodeURIComponent(website.whatsappGreeting || 'Hello!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
            </svg>
          </a>
        )}
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: About, Contact, Hours */}
          <div className="md:col-span-1 space-y-6">
            {/* About section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About Us</h2>
                <p>{website.description}</p>
              </CardContent>
            </Card>

            {/* Contact info */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <div className="space-y-3">
                  {website.address && (
                    <p>
                      <strong>Address:</strong> {website.address}
                    </p>
                  )}
                  {website.phoneNumber && (
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${website.phoneNumber}`} className="hover:underline">
                        {website.phoneNumber}
                      </a>
                    </p>
                  )}
                  {website.email && (
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${website.email}`} className="hover:underline">
                        {website.email}
                      </a>
                    </p>
                  )}
                </div>

                {/* Social links */}
                {website.socialLinks && Object.values(website.socialLinks).some(link => !!link) && (
                  <div className="mt-4">
                    <p className="font-bold mb-2">Follow Us:</p>
                    <div className="flex space-x-4">
                      {website.socialLinks.facebook && (
                        <a 
                          href={website.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Facebook
                        </a>
                      )}
                      {website.socialLinks.instagram && (
                        <a 
                          href={website.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800"
                        >
                          Instagram
                        </a>
                      )}
                      {website.socialLinks.twitter && (
                        <a 
                          href={website.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-600"
                        >
                          Twitter
                        </a>
                      )}
                      {website.socialLinks.yelp && (
                        <a 
                          href={website.socialLinks.yelp} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800"
                        >
                          Yelp
                        </a>
                      )}
                      {website.socialLinks.tripadvisor && (
                        <a 
                          href={website.socialLinks.tripadvisor} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          TripAdvisor
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business hours */}
            {website.businessHours && website.businessHours.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
                  <div className="space-y-2">
                    {website.businessHours.map((hours) => (
                      <div key={hours.day} className="flex justify-between">
                        <span className="capitalize">{hours.day}</span>
                        <span>
                          {hours.open
                            ? `${hours.openTime} - ${hours.closeTime}`
                            : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {website.showMap && website.address && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">
                      Map would display here in a real implementation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact buttons */}
            <div className="flex flex-col space-y-3">
              {website.phoneNumber && (
                <Button className="w-full" asChild>
                  <a href={`tel:${website.phoneNumber}`}>
                    Call Us
                  </a>
                </Button>
              )}
              {website.email && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={`mailto:${website.email}`}>
                    <Mail className="mr-2" size={16} />
                    Email Us
                  </a>
                </Button>
              )}
              {website.whatsappEnabled && website.whatsappNumber && (
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white" 
                  asChild
                >
                  <a 
                    href={`https://wa.me/${website.whatsappNumber}?text=${encodeURIComponent(website.whatsappGreeting || 'Hello!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right column: Menu and Reviews tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="menu">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="menu" className="flex-1">Menu</TabsTrigger>
                {website.showReviews && (
                  <TabsTrigger value="reviews" className="flex-1">
                    Reviews
                    {approvedReviews.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {approvedReviews.length}
                      </span>
                    )}
                  </TabsTrigger>
                )}
                {website.galleryImages && website.galleryImages.length > 0 && (
                  <TabsTrigger value="gallery" className="flex-1">Gallery</TabsTrigger>
                )}
              </TabsList>

              {/* Menu tab content */}
              <TabsContent value="menu" className="space-y-6">
                {restaurantMenuCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <p>No menu items available.</p>
                  </div>
                ) : (
                  restaurantMenuCategories.map((category) => {
                    const categoryItems = restaurantMenuItems.filter(
                      (item) => item.categoryId === category.id
                    );

                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category.id} className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                        <div className="grid grid-cols-1 gap-4">
                          {categoryItems.map((item) => (
                            <Card 
                              key={item.id} 
                              className={`overflow-hidden hover:shadow-md transition-shadow ${
                                item.isPromoted ? "border-2 border-yellow-400" : ""
                              }`}
                              onClick={() => handleMenuItemClick(item.id)}
                            >
                              <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                  {item.imageUrl && (
                                    <div className="sm:w-1/3">
                                      <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-48 sm:h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className={`p-4 flex flex-col justify-between ${
                                    item.imageUrl ? "sm:w-2/3" : "w-full"
                                  }`}>
                                    <div>
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3 className="font-bold text-lg">{item.name}</h3>
                                          <div className="flex items-center mt-1">
                                            {item.isPromoted && (
                                              <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                {item.promotionTag || "Special"}
                                              </span>
                                            )}
                                            {item.isBestseller && (
                                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <Star className="mr-1" size={12} />
                                                Bestseller
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-lg font-bold">
                                          ${item.price.toFixed(2)}
                                        </div>
                                      </div>
                                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              {/* Reviews tab content */}
              {website.showReviews && (
                <TabsContent value="reviews" className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <h2 className="text-2xl font-bold mr-4">Customer Reviews</h2>
                      <div className="flex items-center">
                        <ReviewStars rating={averageRating} />
                        <span className="ml-2">
                          {averageRating.toFixed(1)} ({approvedReviews.length})
                        </span>
                      </div>
                    </div>

                    {/* Review form */}
                    <CustomerReviewForm onSubmit={handleReviewSubmit} />
                    
                    {/* Existing reviews */}
                    <div className="mt-8 space-y-4">
                      {approvedReviews.length > 0 ? (
                        approvedReviews.map((review) => (
                          <Card key={review.id} className="bg-white dark:bg-gray-700">
                            <CardContent className="p-4">
                              <div className="flex justify-between">
                                <h3 className="font-bold">{review.customerName}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {review.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="my-2">
                                <ReviewStars rating={review.rating} />
                              </div>
                              <p className="mt-2">{review.comment}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center py-4">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* Gallery tab content */}
              {website.galleryImages && website.galleryImages.length > 0 && (
                <TabsContent value="gallery">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {website.galleryImages.map((imageUrl, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>

      <footer className={`mt-12 py-6 px-4 ${
        website.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
          {website.loyaltyEnabled && (
            <p className="mt-2">
              <Star className="inline mr-1" size={16} />
              Join our loyalty program and earn points with every order!
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PublicRestaurantWebsite;
