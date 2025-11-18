import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Search, 
  Bell, 
  User, 
  Library, 
  PlayCircle, 
  BookOpen, 
  Upload
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const libraries = [
    { id: 1, name: "Machine Setup", count: 45, color: "bg-primary" },
    { id: 2, name: "Maintenance", count: 32, color: "bg-success" },
    { id: 3, name: "Troubleshooting", count: 28, color: "bg-accent" },
  ];

  const recentActivity = [
    { id: 1, title: "CNC Setup Basics", type: "Watched", time: "2 hours ago" },
    { id: 2, title: "Tooling Maintenance", type: "Completed", time: "1 day ago" },
    { id: 3, title: "Safety Protocols", type: "Started", time: "2 days ago" },
  ];

  const recommendedReels = [
    { id: 1, title: "Quick Tool Change", duration: "0:25", thumbnail: "/placeholder.jpg" },
    { id: 2, title: "Calibration Guide", duration: "0:30", thumbnail: "/placeholder.jpg" },
    { id: 3, title: "Error Code Fix", duration: "0:22", thumbnail: "/placeholder.jpg" },
  ];

  const courseProgress = [
    { id: 1, title: "Advanced CNC Operations", progress: 75 },
    { id: 2, title: "Quality Control", progress: 45 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-background-surface border-r border-border transition-all duration-200`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-primary">Winbro</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="nav-item-active flex items-center gap-3 px-4 py-3 rounded-lg"
            >
              <LayoutDashboard className="h-5 w-5" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </Link>
            <Link
              to="/library"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Library className="h-5 w-5" />
              {!isSidebarCollapsed && <span>Library</span>}
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              {!isSidebarCollapsed && <span>Courses</span>}
            </Link>
            <Link
              to="/upload"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Upload className="h-5 w-5" />
              {!isSidebarCollapsed && <span>Upload</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-background-surface border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search reels, transcripts..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-text-secondary">Here's what's happening with your training today.</p>
            </motion.div>

            {/* Library Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {libraries.map((library, index) => (
                <motion.div
                  key={library.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardHeader>
                      <div className={`${library.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Library className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{library.name}</CardTitle>
                      <CardDescription>{library.count} reels available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/library">Browse Library</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity & Recommended */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest training activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-text-secondary">{activity.type} • {activity.time}</p>
                        </div>
                        <PlayCircle className="h-5 w-5 text-text-secondary" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Reels */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Based on your activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedReels.map((reel) => (
                      <Link
                        key={reel.id}
                        to={`/reel/${reel.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                          <PlayCircle className="h-6 w-6 text-text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{reel.title}</p>
                          <p className="text-sm text-text-secondary">{reel.duration}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courseProgress.map((course) => (
                    <div key={course.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{course.title}</span>
                        <span className="text-sm text-text-secondary">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Reel
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/library">Browse All Reels</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
