
import React, { useState } from 'react';
import { useRestaurantContext } from '../../context/RestaurantContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuPromotionSettingsProps {
  restaurantId: string;
}

export const MenuPromotionSettings: React.FC<MenuPromotionSettingsProps> = ({
  restaurantId
}) => {
  const { menuItems, menuCategories, toggleItemPromotion, toggleItemBestseller } = useRestaurantContext();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [promotionTag, setPromotionTag] = useState<string>('Special');
  
  // Filter items for this restaurant
  const restaurantItems = menuItems.filter(item => item.restaurantId === restaurantId);
  const restaurantCategories = menuCategories.filter(category => category.restaurantId === restaurantId);
  
  // Get the selected item
  const item = restaurantItems.find(item => item.id === selectedItem);
  
  const handleTogglePromotion = (isPromoted: boolean) => {
    if (selectedItem) {
      toggleItemPromotion(selectedItem, isPromoted, isPromoted ? promotionTag : undefined);
    }
  };
  
  const handleToggleBestseller = (isBestseller: boolean) => {
    if (selectedItem) {
      toggleItemBestseller(selectedItem, isBestseller);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="select-item" className="block mb-1">
          Select Menu Item
        </Label>
        
        <Select value={selectedItem} onValueChange={setSelectedItem}>
          <SelectTrigger id="select-item">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {restaurantCategories.map(category => (
              <SelectGroup key={category.id}>
                <SelectItem value={category.id} disabled className="font-bold">
                  {category.name}
                </SelectItem>
                {restaurantItems
                  .filter(item => item.categoryId === category.id)
                  .map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {item && (
        <div className="bg-muted/30 p-4 rounded-md mt-4">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotion-toggle" className="block">
                  Promote this item
                </Label>
                <p className="text-xs text-muted-foreground">
                  Highlighted with a special tag on the menu
                </p>
              </div>
              <Switch 
                id="promotion-toggle"
                checked={!!item.isPromoted}
                onCheckedChange={handleTogglePromotion}
              />
            </div>
            
            {item.isPromoted && (
              <div>
                <Label htmlFor="promotion-tag" className="block mb-1">
                  Promotion Tag
                </Label>
                <Input 
                  id="promotion-tag"
                  value={promotionTag}
                  onChange={(e) => setPromotionTag(e.target.value)}
                  placeholder="e.g., Special, New, Deal"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="bestseller-toggle" className="block">
                  Mark as Bestseller
                </Label>
                <p className="text-xs text-muted-foreground">
                  Shows a '🔥 Bestseller' tag on the item
                </p>
              </div>
              <Switch 
                id="bestseller-toggle"
                checked={!!item.isBestseller}
                onCheckedChange={handleToggleBestseller}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
