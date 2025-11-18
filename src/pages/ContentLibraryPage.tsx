import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Grid, List, PlayCircle, Clock } from "lucide-react";

export default function ContentLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const reels = [
    { id: 1, title: "CNC Setup Basics", duration: "0:25", tags: ["Setup", "CNC"], machine: "CNC-5000" },
    { id: 2, title: "Tooling Maintenance", duration: "0:30", tags: ["Maintenance", "Tools"], machine: "Universal" },
    { id: 3, title: "Error Code Fix", duration: "0:22", tags: ["Troubleshooting"], machine: "CNC-5000" },
    { id: 4, title: "Quick Tool Change", duration: "0:28", tags: ["Setup", "Tools"], machine: "CNC-3000" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Library</h1>
          <p className="text-text-secondary">Discover and filter training reels</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search transcripts, titles, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="card-hover">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-text-secondary" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{reel.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {reel.duration}
                      </span>
                      <span>{reel.machine}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {reel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted rounded text-xs text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link to={`/reel/${reel.id}`}>Watch</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reels.map((reel) => (
              <Card key={reel.id} className="card-hover">
                <div className="flex gap-4 p-4">
                  <div className="w-32 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="h-8 w-8 text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{reel.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {reel.duration}
                      </span>
                      <span>{reel.machine}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {reel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted rounded text-xs text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/reel/${reel.id}`}>Watch</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
