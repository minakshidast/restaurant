
import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, ChevronsUpDown, Users, PanelRight } from "lucide-react";
import { useRestaurantContext } from "../context/RestaurantContext";

const Dashboard: React.FC = () => {
  const { menuItems, tables, staff, orders } = useRestaurantContext();
  
  // Calculate stats
  const activeMenuItems = menuItems.filter(item => item.isAvailable).length;
  const availableTables = tables.filter(table => table.isAvailable).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  
  // Calculate today's sales
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayOrders = orders.filter(
    order => new Date(order.createdAt) >= todayStart
  );
  
  const todaySales = todayOrders.reduce((total, order) => total + order.total, 0);
  
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <Menu className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activeMenuItems}/{menuItems.length}
                </div>
                <p className="text-xs text-muted-foreground">Active items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Tables
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <ChevronsUpDown className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {availableTables}/{tables.length}
                </div>
                <p className="text-xs text-muted-foreground">Ready to seat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Staff Members
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{staff.length}</div>
                <p className="text-xs text-muted-foreground">Active staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <PanelRight className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {pendingOrders}/{totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-2 px-4 text-left font-medium">Order</th>
                    <th className="py-2 px-4 text-left font-medium">Customer</th>
                    <th className="py-2 px-4 text-left font-medium">Status</th>
                    <th className="py-2 px-4 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2 px-4">#{order.id}</td>
                      <td className="py-2 px-4">
                        {order.customerName || `Table ${order.tableId?.replace('table', '')}`}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              ${todaySales.toFixed(2)}
            </div>
            <p className="text-muted-foreground">
              From {todayOrders.length} orders today
            </p>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {order.customerName || `Table ${order.tableId?.replace('table', '')}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
