import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Download, Share2, Heart, Plus, Clock, User, Calendar } from "lucide-react";

export default function ReelDetailPage() {
  const { id: _id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                <PlayCircle className="h-20 w-20 text-primary" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">CNC Setup Basics</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    0:25
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    John Doe
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Jan 15, 2024
                  </span>
                </div>
                <p className="text-text-secondary mb-4">
                  Learn the fundamentals of setting up a CNC machine for optimal performance.
                </p>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Course
                  </Button>
                  <Button variant="outline">Request Retake</Button>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-primary font-medium">[0:00]</span> Welcome to CNC setup basics.
                  </p>
                  <p className="text-sm">
                    <span className="text-primary font-medium">[0:05]</span> First, ensure your machine is properly calibrated.
                  </p>
                  <p className="text-sm">
                    <span className="text-primary font-medium">[0:15]</span> Check all safety protocols before starting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Machine Model</p>
                  <p className="text-sm text-text-secondary">CNC-5000</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Tooling</p>
                  <p className="text-sm text-text-secondary">Standard Tool Set</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Skill Level</p>
                  <p className="text-sm text-text-secondary">Beginner</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 bg-muted rounded text-xs">Setup</span>
                    <span className="px-2 py-1 bg-muted rounded text-xs">CNC</span>
                    <span className="px-2 py-1 bg-muted rounded text-xs">Basics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Reels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded">
                      <div className="w-24 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <PlayCircle className="h-6 w-6 text-text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Related Reel {item}</p>
                        <p className="text-xs text-text-secondary">0:25</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
