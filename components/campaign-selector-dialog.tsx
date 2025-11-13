"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
}

interface CampaignSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Campaign[];
  sourceName: string;
  onSelect: (campaignId: string | null) => void;
  isCreatingCampaign?: boolean;
}

export function CampaignSelectorDialog({
  open,
  onOpenChange,
  campaigns,
  sourceName,
  onSelect,
  isCreatingCampaign = false
}: CampaignSelectorDialogProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [createNew, setCreateNew] = useState(false);

  const handleSubmit = () => {
    if (createNew) {
      onSelect(null); // Signal to create new campaign
    } else if (selectedCampaignId) {
      onSelect(selectedCampaignId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Campaign</DialogTitle>
          <DialogDescription>
            Choose an existing campaign or create a new one for posts from &quot;{sourceName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Campaign Selection</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="create-new"
                  name="campaign-choice"
                  checked={createNew}
                  onChange={() => {
                    setCreateNew(true);
                    setSelectedCampaignId('');
                  }}
                  className="h-4 w-4"
                />
                <label htmlFor="create-new" className="text-sm font-medium cursor-pointer">
                  Create new campaign &quot;{sourceName}&quot;
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="use-existing"
                    name="campaign-choice"
                    checked={!createNew}
                    onChange={() => setCreateNew(false)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="use-existing" className="text-sm font-medium cursor-pointer">
                    Use existing campaign
                  </label>
                </div>

                {!createNew && (
                  <Select
                    value={selectedCampaignId}
                    onValueChange={(value) => {
                      setSelectedCampaignId(value);
                      setCreateNew(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreatingCampaign}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreatingCampaign || (!createNew && !selectedCampaignId)}
          >
            {isCreatingCampaign ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
