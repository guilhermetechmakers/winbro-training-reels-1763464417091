import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <Input placeholder="Search FAQ..." className="pl-10" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Browse help articles and guides.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
