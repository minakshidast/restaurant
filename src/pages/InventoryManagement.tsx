
import React, { useState } from "react";
import { useRestaurantContext } from "../context/RestaurantContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, AlertTriangle, Plus, Package2, Truck, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InventoryManagement = () => {
  // Get inventory-related data and functions from context
  const { 
    currentRestaurant,
    ingredients,
    menuItems,
    menuItemIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    linkIngredientToMenuItem,
    unlinkIngredientFromMenuItem,
    getLowStockIngredients,
    purchaseOrders,
    purchaseOrderItems,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    addPurchaseOrderItem,
    receivePurchaseOrder
  } = useRestaurantContext();

  // States for ingredient management
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    unitType: "kg" as const,
    stockQuantity: 0,
    lowStockThreshold: 5,
    cost: 0,
    supplierId: "",
  });

  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("stock");
  
  // State for purchase order management
  const [newPurchaseOrder, setNewPurchaseOrder] = useState({
    supplierName: "",
    expectedDeliveryDate: "",
    notes: "",
  });
  
  const [isAddPurchaseOrderOpen, setIsAddPurchaseOrderOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<any>(null);
  const [newOrderItem, setNewOrderItem] = useState({
    ingredientId: "",
    quantity: 1,
    cost: 0,
  });

  // Get low stock ingredients
  const lowStockIngredients = getLowStockIngredients();

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    if (newIngredient.name && currentRestaurant) {
      addIngredient({
        name: newIngredient.name,
        unitType: newIngredient.unitType,
        stockQuantity: Number(newIngredient.stockQuantity),
        lowStockThreshold: Number(newIngredient.lowStockThreshold),
        cost: Number(newIngredient.cost),
        supplierId: newIngredient.supplierId,
        restaurantId: currentRestaurant.id,
      });
      
      // Reset form and close dialog
      setNewIngredient({
        name: "",
        unitType: "kg" as const,
        stockQuantity: 0,
        lowStockThreshold: 5,
        cost: 0,
        supplierId: "",
      });
      setIsAddIngredientOpen(false);
    }
  };

  // Handle adding a new purchase order
  const handleAddPurchaseOrder = () => {
    if (newPurchaseOrder.supplierName && currentRestaurant) {
      addPurchaseOrder({
        supplierName: newPurchaseOrder.supplierName,
        status: "pending" as const,
        orderDate: new Date(),
        expectedDeliveryDate: new Date(newPurchaseOrder.expectedDeliveryDate),
        notes: newPurchaseOrder.notes,
        restaurantId: currentRestaurant.id,
        total: 0,
      });
      
      // Reset form and close dialog
      setNewPurchaseOrder({
        supplierName: "",
        expectedDeliveryDate: "",
        notes: "",
      });
      setIsAddPurchaseOrderOpen(false);
    }
  };

  // Handle adding item to purchase order
  const handleAddOrderItem = () => {
    if (selectedPurchaseOrder && newOrderItem.ingredientId) {
      // Find ingredient to get its details
      const ingredient = ingredients.find(i => i.id === newOrderItem.ingredientId);
      
      if (ingredient) {
        addPurchaseOrderItem({
          purchaseOrderId: selectedPurchaseOrder.id,
          ingredientId: newOrderItem.ingredientId,
          ingredientName: ingredient.name,
          quantity: Number(newOrderItem.quantity),
          cost: Number(newOrderItem.cost || ingredient.cost),
        });
        
        // Update the purchase order's total amount
        const orderItems = purchaseOrderItems
          .filter(item => item.purchaseOrderId === selectedPurchaseOrder.id);
        
        const totalCost = orderItems.reduce((sum, item) => sum + item.cost, 0) + 
          Number(newOrderItem.quantity) * Number(newOrderItem.cost || ingredient.cost);
        
        updatePurchaseOrder(selectedPurchaseOrder.id, { total: totalCost });
        
        // Reset form
        setNewOrderItem({
          ingredientId: "",
          quantity: 1,
          cost: 0,
        });
      }
    }
  };

  // Get purchase order items for a specific order
  const getOrderItems = (orderId: string) => {
    return purchaseOrderItems.filter(item => item.purchaseOrderId === orderId);
  };

  // Calculate total cost for a purchase order
  const calculateOrderTotal = (orderId: string) => {
    const items = getOrderItems(orderId);
    return items.reduce((total, item) => total + item.cost, 0);
  };

  // Handle marking a purchase order as received
  const handleReceivePurchaseOrder = (orderId: string) => {
    receivePurchaseOrder(orderId);
  };

  if (!currentRestaurant) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout title="Inventory Management">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
        
        {lowStockIngredients.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Low Stock Warning</AlertTitle>
            <AlertDescription>
              {lowStockIngredients.length} ingredient(s) are running low on stock.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="stock">Stock Management</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Item Ingredients</TabsTrigger>
          </TabsList>
          
          {/* Ingredients Stock Tab */}
          <TabsContent value="stock">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ingredients Inventory</h2>
              <Dialog open={isAddIngredientOpen} onOpenChange={setIsAddIngredientOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Ingredient</DialogTitle>
                    <DialogDescription>
                      Add a new ingredient to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ingredient-name">Name</Label>
                      <Input
                        id="ingredient-name"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="unitType">Unit Type</Label>
                        <Select
                          value={newIngredient.unitType}
                          onValueChange={(value: any) => setNewIngredient({...newIngredient, unitType: value})}
                        >
                          <SelectTrigger id="unitType">
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                            <SelectItem value="grams">Gram (g)</SelectItem>
                            <SelectItem value="liters">Liter (l)</SelectItem>
                            <SelectItem value="ml">Milliliter (ml)</SelectItem>
                            <SelectItem value="pieces">Unit/Piece</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock-quantity">Current Stock</Label>
                        <Input
                          id="stock-quantity"
                          type="number"
                          min="0"
                          value={newIngredient.stockQuantity}
                          onChange={(e) => setNewIngredient({...newIngredient, stockQuantity: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="low-stock">Low Stock Threshold</Label>
                        <Input
                          id="low-stock"
                          type="number"
                          min="0"
                          value={newIngredient.lowStockThreshold}
                          onChange={(e) => setNewIngredient({...newIngredient, lowStockThreshold: Number(e.target.value)})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cost">Cost</Label>
                        <Input
                          id="cost"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newIngredient.cost}
                          onChange={(e) => setNewIngredient({...newIngredient, cost: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="supplier-id">Supplier ID (Optional)</Label>
                      <Input
                        id="supplier-id"
                        value={newIngredient.supplierId}
                        onChange={(e) => setNewIngredient({...newIngredient, supplierId: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddIngredientOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddIngredient}>Add Ingredient</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No ingredients added yet. Add your first ingredient to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>{ingredient.stockQuantity} {ingredient.unitType}</TableCell>
                          <TableCell>{ingredient.unitType}</TableCell>
                          <TableCell>
                            {ingredient.stockQuantity <= ingredient.lowStockThreshold ? (
                              <Badge variant="destructive">Low Stock</Badge>
                            ) : (
                              <Badge variant="outline">In Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell>${ingredient.cost.toFixed(2)} / {ingredient.unitType}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Purchase Orders Tab */}
          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Purchase Orders</h2>
              <Dialog open={isAddPurchaseOrderOpen} onOpenChange={setIsAddPurchaseOrderOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                      Create a new purchase order for ingredients.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="supplier-name">Supplier Name</Label>
                      <Input
                        id="supplier-name"
                        value={newPurchaseOrder.supplierName}
                        onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, supplierName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="delivery-date">Expected Delivery Date</Label>
                      <Input
                        id="delivery-date"
                        type="date"
                        value={newPurchaseOrder.expectedDeliveryDate}
                        onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, expectedDeliveryDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={newPurchaseOrder.notes}
                        onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddPurchaseOrderOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPurchaseOrder}>Create Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-6">
              {purchaseOrders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Package2 className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">No purchase orders created yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsAddPurchaseOrderOpen(true)}
                    >
                      Create Your First Order
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                purchaseOrders.map((order) => (
                  <Card key={order.id} className={order.status === "delivered" ? "border-green-200" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Order from {order.supplierName}</CardTitle>
                          <CardDescription>
                            Order #{order.id.substring(2)} • Created on {new Date(order.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          order.status === "pending" ? "outline" : 
                          order.status === "delivered" ? "secondary" : 
                          "default"
                        }>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Expected Delivery:</span>
                          <span>{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Not specified'}</span>
                        </div>
                        {order.deliveryDate && (
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Actual Delivery:</span>
                            <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">${calculateOrderTotal(order.id).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Order Items</h4>
                          {order.status !== "delivered" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedPurchaseOrder(order)}
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Item
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Item to Order</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="item-ingredient">Ingredient</Label>
                                    <Select
                                      value={newOrderItem.ingredientId}
                                      onValueChange={(value) => setNewOrderItem({...newOrderItem, ingredientId: value})}
                                    >
                                      <SelectTrigger id="item-ingredient">
                                        <SelectValue placeholder="Select Ingredient" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ingredients.map((ingredient) => (
                                          <SelectItem key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name} (${ingredient.cost.toFixed(2)}/{ingredient.unitType})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="item-quantity">Quantity</Label>
                                      <Input
                                        id="item-quantity"
                                        type="number"
                                        min="1"
                                        value={newOrderItem.quantity}
                                        onChange={(e) => setNewOrderItem({...newOrderItem, quantity: Number(e.target.value)})}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="item-price">Cost</Label>
                                      <Input
                                        id="item-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newOrderItem.cost}
                                        onChange={(e) => setNewOrderItem({...newOrderItem, cost: Number(e.target.value)})}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleAddOrderItem}>Add to Order</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ingredient</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getOrderItems(order.id).map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.ingredientName}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.cost.toFixed(2)}</TableCell>
                                <TableCell className="text-right">${(item.quantity * item.cost).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            {getOrderItems(order.id).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No items added to this order yet.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        
                        {order.status === "pending" && (
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleReceivePurchaseOrder(order.id)}
                              disabled={getOrderItems(order.id).length === 0}
                            >
                              <Truck className="h-4 w-4 mr-2" /> Mark as Received
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Menu Item Ingredients Tab */}
          <TabsContent value="menu-items">
            <Card>
              <CardHeader>
                <CardTitle>Menu Item Ingredients</CardTitle>
                <CardDescription>
                  Manage ingredients used in each menu item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {menuItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No menu items found. Add menu items in the Menu Management section first.
                    </div>
                  ) : (
                    menuItems.map((menuItem) => {
                      const itemIngredients = menuItemIngredients.filter(
                        (link) => link.menuItemId === menuItem.id
                      );
                      
                      return (
                        <div key={menuItem.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{menuItem.name}</h3>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-1" /> Add Ingredient
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Ingredient to {menuItem.name}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {/* Form fields for adding ingredients to menu item */}
                                  <div className="grid gap-2">
                                    <Label>Select Ingredient</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose ingredient" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ingredients.map((ingredient) => (
                                          <SelectItem key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Quantity</Label>
                                    <Input type="number" min="0" step="0.01" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button>Add to Recipe</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Stock Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {itemIngredients.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                    No ingredients associated with this menu item.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                itemIngredients.map((link) => {
                                  const ingredient = ingredients.find(i => i.id === link.ingredientId);
                                  
                                  return ingredient ? (
                                    <TableRow key={`${menuItem.id}-${ingredient.id}`}>
                                      <TableCell>{ingredient.name}</TableCell>
                                      <TableCell>{link.quantity} {ingredient.unitType}</TableCell>
                                      <TableCell>
                                        {ingredient.stockQuantity < link.quantity ? (
                                          <Badge variant="destructive">Insufficient</Badge>
                                        ) : (
                                          <Badge variant="outline">Available</Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                      </TableCell>
                                    </TableRow>
                                  ) : null;
                                })
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InventoryManagement;
