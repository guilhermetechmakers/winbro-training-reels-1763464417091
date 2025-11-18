import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditReelPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Reel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Edit Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Edit reel metadata, transcript, and settings.</p>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
