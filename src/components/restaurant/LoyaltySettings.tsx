
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Award } from "lucide-react";

interface LoyaltySettingsProps {
  isEnabled: boolean;
  pointsPerOrder: number;
  onUpdate: (settings: {
    loyaltyEnabled: boolean;
    pointsPerOrder?: number;
  }) => void;
}

export const LoyaltySettings: React.FC<LoyaltySettingsProps> = ({
  isEnabled,
  pointsPerOrder,
  onUpdate,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [points, setPoints] = useState(pointsPerOrder);
  
  const handleToggle = (newEnabledState: boolean) => {
    setEnabled(newEnabledState);
    if (newEnabledState === false) {
      onUpdate({
        loyaltyEnabled: false
      });
    }
  };
  
  const handleSave = () => {
    onUpdate({
      loyaltyEnabled: enabled,
      pointsPerOrder: points,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <Label htmlFor="loyalty-toggle" className="font-medium">
            Enable Loyalty Program
          </Label>
        </div>
        <Switch 
          id="loyalty-toggle"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {enabled && (
        <div className="pt-4 space-y-4">
          <div>
            <Label htmlFor="points-per-order" className="block mb-1">
              Points Per Order
            </Label>
            <Input 
              id="points-per-order"
              type="number"
              min="1"
              max="100"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of points customers earn for each completed order
            </p>
          </div>
          
          <Button onClick={handleSave}>Save Loyalty Settings</Button>
        </div>
      )}
    </div>
  );
};
