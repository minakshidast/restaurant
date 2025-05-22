import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/formatting";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  QrCode,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Menu,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Star,
  MessageSquare,
  Award,
  Gift,
} from "lucide-react";
import { CustomerReviewForm } from "@/components/restaurant/CustomerReviewForm";
import { ReviewStars } from "@/components/restaurant/ReviewStars";

const PublicRestaurant: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    restaurants, 
    menuCategories, 
    menuItems, 
    getRestaurantReviews,
    addCustomerReview,
    recordPageVisit
  } = useRestaurantContext();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("menu");
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [visitRecorded, setVisitRecorded] = useState(false);
  
  // Find the restaurant by slug
  const restaurant = restaurants.find((r) => r.slug === slug);
  
  // Effect to scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);
  
  // Effect to record page visit
  useEffect(() => {
    if (restaurant && !visitRecorded) {
      // Check if this is a unique visitor
      const visitorKey = `visitor-${restaurant.id}`;
      const isUnique = !localStorage.getItem(visitorKey);
      
      // Record the visit
      recordPageVisit(restaurant.id, isUnique);
      
      // Mark this visitor in localStorage
      if (isUnique) {
        localStorage.setItem(visitorKey, new Date().toString());
      }
      
      setVisitRecorded(true);
    }
  }, [restaurant, recordPageVisit, visitRecorded]);

  // If restaurant not found, return error message
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The restaurant you're looking for does not exist.
          </p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Get website data from restaurant
  const websiteData = restaurant.website || {
    theme: 'light',
    primaryColor: '#9b87f5',
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
    loyaltyEnabled: false,
    pointsPerOrder: 10,
    reviewsRequireApproval: true,
    logoUrl: '',
    bannerUrl: '',
    analyticsEnabled: false,
    analyticsCode: '',
    visitorStats: null
  };

  // Menu data
  const restaurantCategories = menuCategories
    .filter((category) => category.restaurantId === restaurant.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
    
  const restaurantItems = menuItems.filter(
    (item) => item.restaurantId === restaurant.id && item.isAvailable
  );

  // Get reviews for this restaurant
  const reviews = getRestaurantReviews(restaurant.id).filter(
    review => !websiteData.reviewsRequireApproval || review.isApproved
  );
  
  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Generate CSS variables for theme
  const themeVars = {
    '--primary-color': websiteData.primaryColor || '#9b87f5',
  } as React.CSSProperties;
  
  // Get today's business hours - Using "long" option and converting to lowercase
  const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  const todaysHours = websiteData.businessHours?.find(hours => hours.day === today);

  // Social Links
  const hasSocialLinks = websiteData.socialLinks && 
    (websiteData.socialLinks.facebook || 
     websiteData.socialLinks.instagram || 
     websiteData.socialLinks.twitter || 
     websiteData.socialLinks.yelp || 
     websiteData.socialLinks.tripadvisor);
  
  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello ${restaurant.name}! I'd like to inquire about your restaurant.`);
    if (websiteData.whatsappNumber) {
      window.open(`https://wa.me/${websiteData.whatsappNumber}?text=${message}`, '_blank');
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = (name: string, email: string, rating: number, comment: string) => {
    addCustomerReview({
      restaurantId: restaurant.id,
      customerName: name,
      customerEmail: email,
      rating,
      comment,
      isApproved: !websiteData.reviewsRequireApproval,
    });
    setReviewFormOpen(false);
  };
  
  return (
    <div className={`min-h-screen ${websiteData.theme === 'dark' ? 'dark' : ''}`} style={themeVars}>
      <div className="bg-background text-foreground">
        {/* Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to={`/${restaurant.slug}`} className="flex items-center space-x-2">
              {websiteData.logoUrl ? (
                <img 
                  src={websiteData.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 sm:h-10 w-auto"
                />
              ) : (
                <h1 className="text-xl font-bold">{restaurant.name}</h1>
              )}
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveSection("menu")}
                className={`px-1 py-2 border-b-2 ${activeSection === "menu" ? "border-primary font-medium" : "border-transparent"} transition-colors hover:text-primary`}
              >
                Menu
              </button>
              {websiteData.galleryImages?.length > 0 && (
                <button 
                  onClick={() => setActiveSection("gallery")}
                  className={`px-1 py-2 border-b-2 ${activeSection === "gallery" ? "border-primary font-medium" : "border-transparent"} transition-colors hover:text-primary`}
                >
                  Photos
                </button>
              )}
              {websiteData.showReviews && (
                <button 
                  onClick={() => setActiveSection("reviews")}
                  className={`px-1 py-2 border-b-2 ${activeSection === "reviews" ? "border-primary font-medium" : "border-transparent"} transition-colors hover:text-primary`}
                >
                  Reviews
                </button>
              )}
              <button 
                onClick={() => setActiveSection("about")}
                className={`px-1 py-2 border-b-2 ${activeSection === "about" ? "border-primary font-medium" : "border-transparent"} transition-colors hover:text-primary`}
                >
                About
              </button>
              <button 
                onClick={() => setActiveSection("contact")}
                className={`px-1 py-2 border-b-2 ${activeSection === "contact" ? "border-primary font-medium" : "border-transparent"} transition-colors hover:text-primary`}
              >
                Contact
              </button>
              
              <Button onClick={() => setQrDialogOpen(true)} className="ml-2" style={{backgroundColor: websiteData.primaryColor}}>
                Order Now
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-t">
              <div className="container mx-auto px-4 py-4 space-y-4">
                <button 
                  onClick={() => {
                    setActiveSection("menu");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 border-b"
                >
                  Menu
                </button>
                {websiteData.galleryImages?.length > 0 && (
                  <button 
                    onClick={() => {
                      setActiveSection("gallery");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 border-b"
                  >
                    Photos
                  </button>
                )}
                {websiteData.showReviews && (
                  <button 
                    onClick={() => {
                      setActiveSection("reviews");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 border-b"
                  >
                    Reviews
                  </button>
                )}
                <button 
                  onClick={() => {
                    setActiveSection("about");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 border-b"
                >
                  About
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("contact");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 border-b"
                >
                  Contact
                </button>
                <Button 
                  onClick={() => {
                    setQrDialogOpen(true);
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full"
                  style={{backgroundColor: websiteData.primaryColor}}
                >
                  Order Now
                </Button>
              </div>
            </div>
          )}
        </header>

        <main>
          {/* Hero Banner */}
          <div className="relative">
            <div className="h-64 md:h-96 w-full bg-muted overflow-hidden">
              {websiteData.bannerUrl ? (
                <img
                  src={websiteData.bannerUrl}
                  alt={`${restaurant.name} banner`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-violet-500 to-purple-500">
                  <h1 className="text-4xl text-white font-bold">{restaurant.name}</h1>
                </div>
              )}
            </div>
            
            <div className="container mx-auto px-4 -mt-16 relative z-10">
              <div className="bg-card rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                    {websiteData.showReviews && reviews.length > 0 && (
                      <div className="flex items-center mt-2">
                        <ReviewStars rating={averageRating} />
                        <span className="ml-2 text-sm">({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                  
                  {websiteData.whatsappEnabled && websiteData.whatsappNumber && (
                    <Button 
                      onClick={handleWhatsAppClick}
                      variant="outline"
                      className="mt-3 md:mt-0 flex items-center gap-2 border-green-500 hover:bg-green-500/10 text-green-600"
                    >
                      <MessageSquare size={18} />
                      <span>WhatsApp Us</span>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  {todaysHours && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {todaysHours.open ? 
                        `Open today ${todaysHours.openTime} - ${todaysHours.closeTime}` : 
                        'Closed today'}
                    </div>
                  )}
                  {websiteData.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {websiteData.address.split(',')[0]}
                    </div>
                  )}
                  {websiteData.phoneNumber && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-1" />
                      {websiteData.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <section id="menu" className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-8">Our Menu</h2>
            
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
                
                {restaurantCategories.map((category) => {
                  const categoryItems = restaurantItems.filter(
                    (item) => item.categoryId === category.id
                  );
                  
                  return (
                    <TabsContent key={category.id} value={category.id}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryItems.length > 0 ? (
                          categoryItems.map((item) => (
                            <div 
                              key={item.id} 
                              className={`border rounded-md overflow-hidden flex flex-col md:flex-row ${
                                item.isPromoted ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => {
                                if (restaurant) {
                                  recordPageVisit(restaurant.id, false, item.id);
                                }
                              }}
                            >
                              {item.imageUrl && (
                                <div className="w-full md:w-1/3 h-32 md:h-auto bg-muted relative">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {(item.isPromoted || item.isBestseller) && (
                                    <div className="absolute top-0 left-0">
                                      <div 
                                        className="px-2 py-1 text-xs font-medium text-white"
                                        style={{backgroundColor: websiteData.primaryColor}}
                                      >
                                        {item.isPromoted ? (item.promotionTag || 'Special') : '🔥 Bestseller'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="font-medium" style={{color: websiteData.primaryColor}}>
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
                  );
                })}
              </Tabs>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">This restaurant has no menu items yet.</p>
              </div>
            )}
          </section>
          
          {/* Gallery Section */}
          {websiteData.galleryImages?.length > 0 && (
            <section id="gallery" className="bg-muted py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {websiteData.galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src={image} 
                        alt={`Gallery image ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Reviews Section */}
          {websiteData.showReviews && (
            <section id="reviews" className="container mx-auto px-4 py-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <Button 
                  onClick={() => setReviewFormOpen(true)}
                  style={{backgroundColor: websiteData.primaryColor}}
                >
                  Write a Review
                </Button>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="mt-1">
                        <ReviewStars rating={averageRating} />
                      </div>
                      <div className="text-sm mt-1">{reviews.length} reviews</div>
                    </div>
                    
                    <div className="ml-6 flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const ratingCount = reviews.filter(r => Math.floor(r.rating) === rating).length;
                        const percentage = reviews.length ? (ratingCount / reviews.length) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center mb-1">
                            <div className="w-12 text-sm">{rating} stars</div>
                            <div className="flex-1 mx-2 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: websiteData.primaryColor
                                }}
                              ></div>
                            </div>
                            <div className="w-10 text-sm text-right">{ratingCount}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{review.customerName}</h3>
                        <ReviewStars rating={review.rating} />
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {review.comment}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  <Button 
                    onClick={() => setReviewFormOpen(true)} 
                    className="mt-4"
                    style={{backgroundColor: websiteData.primaryColor}}
                  >
                    Write a Review
                  </Button>
                </div>
              )}
              
              <Dialog open={reviewFormOpen} onOpenChange={setReviewFormOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience at {restaurant.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <CustomerReviewForm 
                    onSubmit={handleReviewSubmit}
                    primaryColor={websiteData.primaryColor}
                  />
                </DialogContent>
              </Dialog>
            </section>
          )}
          
          {/* About Section */}
          <section id="about" className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">About Us</h2>
            {websiteData.description ? (
              <div className="prose max-w-none">
                <p>{websiteData.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Welcome to {restaurant.name}. We look forward to serving you!
              </p>
            )}
            
            {/* Business Hours */}
            <h3 className="text-xl font-bold mt-8 mb-4">Business Hours</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <tbody>
                  {websiteData.businessHours?.map((hours, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-muted/50' : ''}`}>
                      <td className="py-2 px-4 font-medium capitalize">{hours.day}</td>
                      <td className="py-2 px-4 text-right">
                        {hours.open ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Loyalty Program */}
            {websiteData.loyaltyEnabled && (
              <div className="mt-8 border rounded-lg p-6 bg-muted/30">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 mr-3" style={{color: websiteData.primaryColor}} />
                  <h3 className="text-xl font-bold">Loyalty Rewards Program</h3>
                </div>
                <p className="mb-4">
                  Join our loyalty program and earn {websiteData.pointsPerOrder} points with every order!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-card rounded-md p-4 text-center">
                    <Gift className="h-6 w-6 mx-auto mb-2" style={{color: websiteData.primaryColor}} />
                    <div className="font-medium">Earn Points</div>
                    <div className="text-sm text-muted-foreground">
                      {websiteData.pointsPerOrder} points per order
                    </div>
                  </div>
                  <div className="flex-1 bg-card rounded-md p-4 text-center">
                    <Award className="h-6 w-6 mx-auto mb-2" style={{color: websiteData.primaryColor}} />
                    <div className="font-medium">Get Rewards</div>
                    <div className="text-sm text-muted-foreground">
                      Redeem points for discounts
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          {/* Contact Section */}
          <section id="contact" className="bg-muted py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {/* Contact Information */}
                  {websiteData.address && (
                    <div className="flex mb-4">
                      <MapPin className="h-5 w-5 mr-3 text-primary" style={{color: websiteData.primaryColor}} />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-muted-foreground">{websiteData.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {websiteData.phoneNumber && (
                    <div className="flex mb-4">
                      <Phone className="h-5 w-5 mr-3 text-primary" style={{color: websiteData.primaryColor}} />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-muted-foreground">
                          <a href={`tel:${websiteData.phoneNumber}`}>{websiteData.phoneNumber}</a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {websiteData.email && (
                    <div className="flex mb-4">
                      <Globe className="h-5 w-5 mr-3 text-primary" style={{color: websiteData.primaryColor}} />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">
                          <a href={`mailto:${websiteData.email}`}>{websiteData.email}</a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Social Media Links */}
                  {hasSocialLinks && (
                    <>
                      <h3 className="font-medium mt-8 mb-4">Follow Us</h3>
                      <div className="flex space-x-4">
                        {websiteData.socialLinks?.facebook && (
                          <a 
                            href={websiteData.socialLinks.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                          >
                            <Facebook className="h-6 w-6 text-primary hover:text-primary/80" style={{color: websiteData.primaryColor}} />
                          </a>
                        )}
                        
                        {websiteData.socialLinks?.instagram && (
                          <a 
                            href={websiteData.socialLinks.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                          >
                            <Instagram className="h-6 w-6 text-primary hover:text-primary/80" style={{color: websiteData.primaryColor}} />
                          </a>
                        )}
                        
                        {websiteData.socialLinks?.twitter && (
                          <a 
                            href={websiteData.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                          >
                            <Twitter className="h-6 w-6 text-primary hover:text-primary/80" style={{color: websiteData.primaryColor}} />
                          </a>
                        )}
                        
                        {websiteData.socialLinks?.yelp && (
                          <a 
                            href={websiteData.socialLinks.yelp} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Yelp"
                          >
                            <Globe className="h-6 w-6 text-primary hover:text-primary/80" style={{color: websiteData.primaryColor}} />
                          </a>
                        )}
                        
                        {websiteData.socialLinks?.tripadvisor && (
                          <a 
                            href={websiteData.socialLinks.tripadvisor} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="TripAdvisor"
                          >
                            <Globe className="h-6 w-6 text-primary hover:text-primary/80" style={{color: websiteData.primaryColor}} />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {websiteData.showMap && websiteData.address && (
                  <div>
                    <div className="bg-card rounded-md border h-64 flex items-center justify-center">
                      {/* This would be replaced with an actual map embed in a production app */}
                      <div className="text-center p-4">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" style={{color: websiteData.primaryColor}} />
                        <p>Map view would appear here</p>
                        <p className="text-sm text-muted-foreground mt-2">{websiteData.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} All rights reserved
                </p>
              </div>
              
              <div className="flex gap-3">
                {websiteData.whatsappEnabled && websiteData.whatsappNumber && (
                  <Button 
                    onClick={handleWhatsAppClick}
                    variant="outline"
                    className="flex items-center gap-2 border-green-500 hover:bg-green-500/10 text-green-600"
                  >
                    <MessageSquare size={18} />
                    <span>WhatsApp</span>
                  </Button>
                )}
                <Button onClick={() => setQrDialogOpen(true)} style={{backgroundColor: websiteData.primaryColor}}>
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        </footer>
        
        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan to Order</DialogTitle>
              <DialogDescription>
                Scan this QR code with your phone camera to place an order.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center py-6">
              <div className="bg-white p-4 rounded-md">
                {/* QR Code */}
                <div className="w-48 h-48 bg-white flex items-center justify-center">
                  <QrCode size={120} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Or call us directly at:{" "}
                <a href={`tel:${websiteData.phoneNumber}`} className="text-primary" style={{color: websiteData.primaryColor}}>
                  {websiteData.phoneNumber || 'N/A'}
                </a>
              </p>
              
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  Download QR Code
                </Button>
                <Button variant="outline" size="sm">
                  Share Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Analytics Code - would be inserted in a real implementation */}
        {websiteData.analyticsEnabled && websiteData.analyticsCode && (
          <div dangerouslySetInnerHTML={{ __html: websiteData.analyticsCode }} />
        )}
      </div>
    </div>
  );
};

export default PublicRestaurant;
