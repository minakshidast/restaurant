import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "../utils/formatting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Check, Clock, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrdersManagement: React.FC = () => {
  const { currentRestaurant, orders, updateOrderStatus } = useRestaurantContext();
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  
  // Filter orders by restaurant and status
  const restaurantOrders = orders.filter(
    order => order.restaurantId === currentRestaurant?.id
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const pendingOrders = restaurantOrders.filter(order => order.status === "pending");
  const preparingOrders = restaurantOrders.filter(order => order.status === "preparing");
  const completedOrders = restaurantOrders.filter(order => order.status === "completed");
  
  // Handle order status change
  const handleChangeStatus = (orderId: string, newStatus: "pending" | "preparing" | "completed") => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order status updated",
      description: `Order status changed to ${newStatus}`,
    });
  };
  
  // Open order details dialog
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "preparing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Preparing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Render orders list
  const renderOrdersList = (ordersList: any[]) => {
    return ordersList.length > 0 ? (
      <div className="space-y-4">
        {ordersList.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b bg-card">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">Order #{order.id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(order.createdAt))}
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <p className="font-medium mr-4">
                  {formatCurrency(order.total)}
                </p>
                
                <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                  View Details
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={order.status === "pending"}
                      onClick={() => handleChangeStatus(order.id, "pending")}
                    >
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={order.status === "preparing"}
                      onClick={() => handleChangeStatus(order.id, "preparing")}
                    >
                      Mark as Preparing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={order.status === "completed"}
                      onClick={() => handleChangeStatus(order.id, "completed")}
                    >
                      Mark as Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center text-sm">
                <div className="flex-1">
                  <p className="font-medium">
                    {order.customerName || `Table ${order.tableId?.replace('table', '')}`}
                  </p>
                  <p className="text-muted-foreground">
                    {order.items.length} items
                  </p>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0 space-x-2">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleChangeStatus(order.id, "preparing")}
                      className="flex items-center"
                    >
                      <Clock size={16} className="mr-1" /> Start Preparing
                    </Button>
                  )}
                  
                  {order.status === "preparing" && (
                    <Button
                      size="sm"
                      onClick={() => handleChangeStatus(order.id, "completed")}
                      className="flex items-center bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} className="mr-1" /> Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  };

  return (
    <DashboardLayout title="Orders">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders ({restaurantOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({preparingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="all">
            {renderOrdersList(restaurantOrders)}
          </TabsContent>
          
          <TabsContent value="pending">
            {renderOrdersList(pendingOrders)}
          </TabsContent>
          
          <TabsContent value="preparing">
            {renderOrdersList(preparingOrders)}
          </TabsContent>
          
          <TabsContent value="completed">
            {renderOrdersList(completedOrders)}
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder && formatDate(new Date(selectedOrder.createdAt))}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Customer</h4>
                <p>
                  {selectedOrder.customerName || `Table ${selectedOrder.tableId?.replace('table', '')}`}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.menuItemName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-between items-center">
                <p className="font-medium">Total</p>
                <p className="text-xl font-bold">
                  {formatCurrency(selectedOrder.total)}
                </p>
              </div>
              
              <div className="pt-4 flex space-x-2 justify-end">
                {selectedOrder.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "preparing");
                      setOrderDetailsOpen(false);
                    }}
                  >
                    Start Preparing
                  </Button>
                )}
                
                {selectedOrder.status === "preparing" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "completed");
                      setOrderDetailsOpen(false);
                    }}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OrdersManagement;
