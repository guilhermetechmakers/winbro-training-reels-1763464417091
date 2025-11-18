import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">125</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Videos Uploaded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5,678</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
