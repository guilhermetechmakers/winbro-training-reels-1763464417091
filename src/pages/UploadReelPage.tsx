import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo } from "lucide-react";

export default function UploadReelPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload New Reel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>Drag and drop your video file or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <FileVideo className="h-16 w-16 mx-auto mb-4 text-text-secondary" />
              <p className="text-text-secondary mb-4">Maximum duration: 30 seconds</p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
