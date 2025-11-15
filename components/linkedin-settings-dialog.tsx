"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2, ExternalLink, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

interface LinkedInSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsSaved: () => void;
}

interface LinkedInSettings {
  configured: boolean;
  clientId: string | null;
  redirectUri: string | null;
}

export function LinkedInSettingsDialog({
  open,
  onOpenChange,
  onSettingsSaved
}: LinkedInSettingsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<LinkedInSettings | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/api/auth/linkedin/callback');

  // Fetch current settings when dialog opens
  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/linkedin');
      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setSettings(data);

      // Pre-fill form with existing values
      if (data.clientId) setClientId(data.clientId);
      if (data.redirectUri) setRedirectUri(data.redirectUri);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load LinkedIn settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!clientId.trim() || !clientSecret.trim() || !redirectUri.trim()) {
      toast.error('All fields are required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          redirectUri: redirectUri.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      toast.success('LinkedIn OAuth credentials saved successfully');
      onSettingsSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your LinkedIn OAuth credentials? This will disconnect your LinkedIn account.')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/linkedin', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete settings');
      }

      toast.success('LinkedIn OAuth credentials removed');
      onSettingsSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete settings');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>LinkedIn OAuth Configuration</DialogTitle>
          <DialogDescription>
            Configure your own LinkedIn app credentials to enable posting to LinkedIn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Information Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <div className="ml-2">
              <p className="text-sm font-medium">Why do I need this?</p>
              <p className="text-sm text-slate-600 mt-1">
                Since Navam Marketer is a self-hosted application, you need to create your own LinkedIn app
                to enable posting. This ensures your posts are published from your own account with your own permissions.
              </p>
            </div>
          </Alert>

          {/* Step-by-step guide */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Setup Instructions:</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Create a LinkedIn App</p>
                  <p className="text-slate-600 mt-1">
                    Visit the LinkedIn Developers portal and create a new app
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('https://www.linkedin.com/developers/apps', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open LinkedIn Developers
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Configure Redirect URI</p>
                  <p className="text-slate-600 mt-1">
                    In your LinkedIn app's Auth settings, add this redirect URI:
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 p-2 bg-slate-100 rounded text-xs font-mono break-all">
                      {redirectUri}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(redirectUri, 'redirectUri')}
                    >
                      {copiedField === 'redirectUri' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Request Required Products</p>
                  <p className="text-slate-600 mt-1">
                    In the Products tab, request access to:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-1">
                    <li>Sign In with LinkedIn using OpenID Connect</li>
                    <li>Share on LinkedIn</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium">Copy Your Credentials</p>
                  <p className="text-slate-600 mt-1">
                    From the Auth tab, copy your Client ID and Client Secret and paste them below
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 border-t pt-6">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                placeholder="Your LinkedIn app's client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret *</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Your LinkedIn app's client secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Your client secret is stored securely and never displayed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUri">Redirect URI *</Label>
              <Input
                id="redirectUri"
                placeholder="http://localhost:3000/api/auth/linkedin/callback"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                This must match exactly with what's configured in your LinkedIn app
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              {settings?.configured && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Credentials
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Credentials
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
