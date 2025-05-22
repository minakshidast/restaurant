
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Menu, ChevronsUpDown, Users, Settings, Utensils, Globe, Package, ShoppingCart, User } from "lucide-react";
import { useRestaurantContext } from "../../context/RestaurantContext";

const DashboardSidebar: React.FC = () => {
  const { currentRestaurant } = useRestaurantContext();
  const location = useLocation();
  
  // If no current restaurant, don't show the sidebar
  if (!currentRestaurant) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-white truncate">
          {currentRestaurant.name}
        </h2>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        <Link to="/dashboard" className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link to="/dashboard/menu" className={`sidebar-link ${isActive("/dashboard/menu") ? "active" : ""}`}>
          <Menu size={20} />
          <span>Menu</span>
        </Link>
        
        <Link to="/dashboard/inventory" className={`sidebar-link ${isActive("/dashboard/inventory") ? "active" : ""}`}>
          <Package size={20} />
          <span>Inventory</span>
        </Link>
        
        <Link to="/dashboard/orders" className={`sidebar-link ${isActive("/dashboard/orders") ? "active" : ""}`}>
          <ShoppingCart size={20} />
          <span>POS & Orders</span>
        </Link>
        
        <Link to="/dashboard/tables" className={`sidebar-link ${isActive("/dashboard/tables") ? "active" : ""}`}>
          <ChevronsUpDown size={20} />
          <span>Tables</span>
        </Link>
        
        <Link to="/dashboard/staff" className={`sidebar-link ${isActive("/dashboard/staff") ? "active" : ""}`}>
          <Users size={20} />
          <span>Staff</span>
        </Link>
        
        <Link to="/dashboard/customers" className={`sidebar-link ${isActive("/dashboard/customers") ? "active" : ""}`}>
          <User size={20} />
          <span>Customers</span>
        </Link>
        
        <Link to="/dashboard/website" className={`sidebar-link ${isActive("/dashboard/website") ? "active" : ""}`}>
          <Globe size={20} />
          <span>Website</span>
        </Link>
        
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <Link to="/dashboard/settings" className={`sidebar-link ${isActive("/dashboard/settings") ? "active" : ""}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Link to={`/${currentRestaurant.slug}`} className="sidebar-link" target="_blank">
          <Utensils size={20} />
          <span>View Menu Page</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
