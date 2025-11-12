import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceIngestion } from '@/components/source-ingestion';
import { ArrowRight, FolderKanban, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Navam Marketer</h1>
        <p className="text-lg text-slate-600">
          Marketing automation for bootstrapped founders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Source Ingestion
            </CardTitle>
            <CardDescription>
              Extract content from URLs for your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Paste a URL to fetch and clean content for use in your social media posts.
            </p>
          </CardContent>
        </Card>

        <Link href="/campaigns">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Campaigns
              </CardTitle>
              <CardDescription>
                Manage your marketing campaigns with Kanban boards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Create campaigns, add tasks, and manage them with drag-and-drop.
              </p>
              <Button variant="outline" className="w-full">
                Go to Campaigns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <SourceIngestion />
    </div>
  );
}
