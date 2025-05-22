
import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerManagement: React.FC = () => {
  const { customers } = useRestaurantContext();

  return (
    <DashboardLayout title="Customer Management">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Customer Database</h2>
        <p className="text-muted-foreground">
          Manage your customers and track their preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            View and manage your customer database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <div>Customer list will be displayed here</div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                No customers in your database yet.
              </p>
              <Button>Add Your First Customer</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CustomerManagement;
