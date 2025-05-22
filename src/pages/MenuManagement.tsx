import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "../utils/formatting";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const MenuManagement: React.FC = () => {
  const { 
    currentRestaurant, 
    menuCategories, 
    addMenuCategory, 
    updateMenuCategory,
    deleteMenuCategory, 
    menuItems, 
    addMenuItem, 
    updateMenuItem,
    deleteMenuItem
  } = useRestaurantContext();

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    sortOrder: 0,
  });
  
  const [itemForm, setItemForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "/placeholder.svg",
    isAvailable: true,
    categoryId: "",
  });
  
  // Edit flags
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);

  // Current restaurant's categories and items
  const restaurantCategories = menuCategories.filter(
    category => category.restaurantId === currentRestaurant?.id
  ).sort((a, b) => a.sortOrder - b.sortOrder);
  
  const restaurantItems = menuItems.filter(
    item => item.restaurantId === currentRestaurant?.id
  );

  // Reset category form
  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      name: "",
      sortOrder: restaurantCategories.length + 1,
    });
    setIsEditingCategory(false);
  };
  
  // Reset item form
  const resetItemForm = () => {
    setItemForm({
      id: "",
      name: "",
      description: "",
      price: 0,
      imageUrl: "/placeholder.svg",
      isAvailable: true,
      categoryId: restaurantCategories.length > 0 ? restaurantCategories[0].id : "",
    });
    setIsEditingItem(false);
  };
  
  // Handle category edit
  const handleEditCategory = (category: any) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      sortOrder: category.sortOrder,
    });
    setIsEditingCategory(true);
    setCategoryDialogOpen(true);
  };
  
  // Handle item edit
  const handleEditItem = (item: any) => {
    setItemForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      categoryId: item.categoryId,
    });
    setIsEditingItem(true);
    setItemDialogOpen(true);
  };
  
  // Handle category submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditingCategory) {
      updateMenuCategory(categoryForm.id, {
        name: categoryForm.name,
        sortOrder: categoryForm.sortOrder,
      });
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } else {
      if (!currentRestaurant) return;
      
      addMenuCategory({
        name: categoryForm.name,
        restaurantId: currentRestaurant.id,
        sortOrder: categoryForm.sortOrder,
      });
      toast({
        title: "Success",
        description: "Category added successfully"
      });
    }
    
    resetCategoryForm();
    setCategoryDialogOpen(false);
  };
  
  // Handle item submit
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemForm.name || !itemForm.categoryId || itemForm.price <= 0) {
      toast({
        title: "Error",
        description: "Name, category and price are required",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditingItem) {
      updateMenuItem(itemForm.id, {
        name: itemForm.name,
        description: itemForm.description,
        price: itemForm.price,
        imageUrl: itemForm.imageUrl,
        isAvailable: itemForm.isAvailable,
        categoryId: itemForm.categoryId,
      });
      toast({
        title: "Success",
        description: "Menu item updated successfully"
      });
    } else {
      if (!currentRestaurant) return;
      
      addMenuItem({
        name: itemForm.name,
        description: itemForm.description,
        price: itemForm.price,
        imageUrl: itemForm.imageUrl,
        isAvailable: itemForm.isAvailable,
        categoryId: itemForm.categoryId,
        restaurantId: currentRestaurant.id,
      });
      toast({
        title: "Success",
        description: "Menu item added successfully"
      });
    }
    
    resetItemForm();
    setItemDialogOpen(false);
  };
  
  // Handle category delete
  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? All menu items in this category will also be deleted.")) {
      deleteMenuCategory(categoryId);
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
    }
  };
  
  // Handle item delete
  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem(itemId);
      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      });
    }
  };
  
  // Handle item availability toggle
  const handleToggleItemAvailability = (itemId: string, isAvailable: boolean) => {
    updateMenuItem(itemId, { isAvailable });
  };
  
  return (
    <DashboardLayout title="Menu Management">
      <Tabs defaultValue="items">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <div>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <Plus size={16} className="mr-1" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingCategory ? "Edit Category" : "Add Category"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingCategory
                      ? "Update this menu category's details"
                      : "Create a new category to organize your menu items"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCategorySubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, name: e.target.value })
                        }
                        placeholder="e.g. Appetizers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Display Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={categoryForm.sortOrder}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            sortOrder: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower numbers appear first on the menu
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetCategoryForm();
                      setCategoryDialogOpen(false);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingCategory ? "Update" : "Add"} Category
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-1" /> Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditingItem ? "Edit Menu Item" : "Add Menu Item"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingItem
                      ? "Update this menu item's details"
                      : "Add a new item to your restaurant menu"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleItemSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={itemForm.name}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, name: e.target.value })
                        }
                        placeholder="e.g. Margherita Pizza"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={itemForm.description}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, description: e.target.value })
                        }
                        placeholder="Describe the menu item..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={itemForm.categoryId}
                          onValueChange={(value) =>
                            setItemForm({ ...itemForm, categoryId: value })
                          }
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {restaurantCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={itemForm.imageUrl}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, imageUrl: e.target.value })
                        }
                        placeholder="/placeholder.svg"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={itemForm.isAvailable}
                        onCheckedChange={(checked) =>
                          setItemForm({ ...itemForm, isAvailable: checked })
                        }
                      />
                      <Label htmlFor="isAvailable">Available for ordering</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetItemForm();
                      setItemDialogOpen(false);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingItem ? "Update" : "Add"} Menu Item
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="items" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantCategories.map((category) => {
              const categoryItems = restaurantItems.filter(
                (item) => item.categoryId === category.id
              );
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryItems.length > 0 ? (
                      <div className="space-y-4">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-md p-4 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`available-${item.id}`}
                                  checked={item.isAvailable}
                                  onCheckedChange={(checked) =>
                                    handleToggleItemAvailability(item.id, checked)
                                  }
                                />
                                <Label htmlFor={`available-${item.id}`} className="text-sm">
                                  {item.isAvailable ? "Available" : "Unavailable"}
                                </Label>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No items in this category
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {restaurantCategories.length === 0 && (
              <div className="col-span-full text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No categories yet. Add a category to begin.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {restaurantCategories.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Order</th>
                        <th className="text-left p-4 font-medium">Category Name</th>
                        <th className="text-left p-4 font-medium">Items</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantCategories.map((category) => {
                        const itemCount = restaurantItems.filter(
                          (item) => item.categoryId === category.id
                        ).length;
                        
                        return (
                          <tr key={category.id} className="border-b">
                            <td className="p-4">{category.sortOrder}</td>
                            <td className="p-4 font-medium">{category.name}</td>
                            <td className="p-4">{itemCount} items</td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                                className="mr-2"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No categories yet. Add a category to begin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MenuManagement;
