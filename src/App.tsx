
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "./context/RestaurantContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import TablesStaffManagement from "./pages/TablesStaffManagement";
import OrdersManagement from "./pages/OrdersManagement";
import InventoryManagement from "./pages/InventoryManagement";
import WebsiteManagement from "./pages/WebsiteManagement";
import CustomerManagement from "./pages/CustomerManagement";
import PublicRestaurant from "./pages/PublicRestaurant";
import PublicRestaurantWebsite from "./pages/PublicRestaurantWebsite";
import NotFoundPage from "./pages/NotFoundPage";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RestaurantProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/menu" element={<MenuManagement />} />
            <Route path="/dashboard/inventory" element={<InventoryManagement />} />
            <Route path="/dashboard/tables" element={<TablesStaffManagement />} />
            <Route path="/dashboard/staff" element={<TablesStaffManagement />} />
            <Route path="/dashboard/orders" element={<OrdersManagement />} />
            <Route path="/dashboard/customers" element={<CustomerManagement />} />
            <Route path="/dashboard/website" element={<WebsiteManagement />} />
            <Route path="/:slug" element={<PublicRestaurantWebsite />} />
            <Route path="/:slug/menu" element={<PublicRestaurant />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </RestaurantProvider>
  </QueryClientProvider>
);

export default App;
