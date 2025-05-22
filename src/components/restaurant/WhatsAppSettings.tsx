
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from "lucide-react";

interface WhatsAppSettingsProps {
  isEnabled: boolean;
  whatsappNumber: string;
  whatsappGreeting: string;
  onUpdate: (settings: {
    whatsappEnabled: boolean;
    whatsappNumber?: string;
    whatsappGreeting?: string;
  }) => void;
}

export const WhatsAppSettings: React.FC<WhatsAppSettingsProps> = ({
  isEnabled,
  whatsappNumber,
  whatsappGreeting,
  onUpdate,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [number, setNumber] = useState(whatsappNumber || '');
  const [greeting, setGreeting] = useState(whatsappGreeting || 'Hello! I would like to place an order.');
  
  const handleToggle = (newEnabledState: boolean) => {
    setEnabled(newEnabledState);
    if (newEnabledState === false) {
      onUpdate({
        whatsappEnabled: false
      });
    }
  };
  
  const handleSave = () => {
    onUpdate({
      whatsappEnabled: enabled,
      whatsappNumber: number,
      whatsappGreeting: greeting,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <Label htmlFor="whatsapp-toggle" className="font-medium">
            Enable WhatsApp Button
          </Label>
        </div>
        <Switch 
          id="whatsapp-toggle"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {enabled && (
        <div className="pt-4 space-y-4">
          <div>
            <Label htmlFor="whatsapp-number" className="block mb-1">
              WhatsApp Number (with country code)
            </Label>
            <Input 
              id="whatsapp-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="+1234567890"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include the country code with no spaces or special characters (e.g., +1234567890)
            </p>
          </div>
          
          <div>
            <Label htmlFor="whatsapp-greeting" className="block mb-1">
              Pre-filled Message
            </Label>
            <Textarea 
              id="whatsapp-greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Hello! I would like to place an order."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be pre-filled when customers click the WhatsApp button
            </p>
          </div>
          
          <Button onClick={handleSave}>Save WhatsApp Settings</Button>
        </div>
      )}
    </div>
  );
};
