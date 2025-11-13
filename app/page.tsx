import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceIngestion } from '@/components/source-ingestion';
import { ArrowRight, FolderKanban, FileText, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome to Navam Marketer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your content into social promotions with AI-powered automation
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/sources">
          <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full border-2 hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Sources
              </CardTitle>
              <CardDescription>
                Manage your content sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add URLs, view ingested content, and generate posts from sources.
              </p>
              <Button variant="outline" className="w-full">
                View Sources
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/campaigns">
          <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full border-2 hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-green-500" />
                Campaigns
              </CardTitle>
              <CardDescription>
                Organize with Kanban boards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create campaigns, manage tasks, schedule posts, and track metrics.
              </p>
              <Button variant="outline" className="w-full">
                Go to Campaigns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Quick Start
            </CardTitle>
            <CardDescription>
              3-step workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">1.</span>
                Add a content source
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">2.</span>
                Create a campaign
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">3.</span>
                Generate posts with AI
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Source Ingestion */}
      <SourceIngestion />
    </div>
  );
}
