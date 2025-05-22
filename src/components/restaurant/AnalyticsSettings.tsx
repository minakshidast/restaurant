
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart } from "lucide-react";

interface AnalyticsSettingsProps {
  isEnabled: boolean;
  analyticsCode?: string;
  onUpdate: (settings: {
    analyticsEnabled: boolean;
    analyticsCode?: string;
  }) => void;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({
  isEnabled,
  analyticsCode,
  onUpdate,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [code, setCode] = useState(analyticsCode || '');
  
  const handleToggle = (newEnabledState: boolean) => {
    setEnabled(newEnabledState);
    if (newEnabledState === false) {
      onUpdate({
        analyticsEnabled: false
      });
    }
  };
  
  const handleSave = () => {
    onUpdate({
      analyticsEnabled: enabled,
      analyticsCode: code,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-600" />
          <Label htmlFor="analytics-toggle" className="font-medium">
            Enable Google Analytics / Meta Pixel
          </Label>
        </div>
        <Switch 
          id="analytics-toggle"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {enabled && (
        <div className="pt-4 space-y-4">
          <div>
            <Label htmlFor="analytics-code" className="block mb-1">
              Tracking Code
            </Label>
            <Textarea 
              id="analytics-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="<!-- Paste your Google Analytics or Meta Pixel code here -->"
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the complete tracking code snippet from Google Analytics or Meta Pixel
            </p>
          </div>
          
          <Button onClick={handleSave}>Save Analytics Settings</Button>
        </div>
      )}
    </div>
  );
};
