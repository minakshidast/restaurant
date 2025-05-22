
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Bistro Hub</h1>
          </div>
          <div>
            <Link to="/onboarding">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Complete SaaS Platform for Modern Restaurants
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Manage your menu, tables, staff and orders - all in one place. Grow your business with tools built for restaurants.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/onboarding">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Your Restaurant
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-card">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Run Your Restaurant
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Menu Management</h3>
                <p className="text-muted-foreground">
                  Easily create and manage your menu items, categories, and pricing.
                </p>
              </div>
              
              <div className="border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Table & Staff Management</h3>
                <p className="text-muted-foreground">
                  Manage your tables and staff members all in one place.
                </p>
              </div>
              
              <div className="border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Processing</h3>
                <p className="text-muted-foreground">
                  Track and manage orders, from receipt to delivery.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">Bistro Hub</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Bistro Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
