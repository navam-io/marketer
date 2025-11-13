import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
                Add content sources by URL. Extract and save clean, readable content for AI-powered post generation.
              </p>
              <Button variant="outline" className="w-full">
                Manage Sources
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
                Go to Sources and add content URLs
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">2.</span>
                Create a campaign on Campaigns page
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">3.</span>
                Generate and schedule AI-powered posts
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Description */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Your content marketing automation workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Add Sources</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to the Sources page and click "Add Source". Paste URLs from your blog posts, articles, or any web content you want to repurpose.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create Campaigns</h3>
              <p className="text-sm text-muted-foreground">
                Organize your social media efforts into campaigns. Each campaign has its own Kanban board to manage tasks across different platforms.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Generate & Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Use AI to transform your source content into platform-optimized posts for LinkedIn, Twitter, and blogs. Review, edit, schedule, and track performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
