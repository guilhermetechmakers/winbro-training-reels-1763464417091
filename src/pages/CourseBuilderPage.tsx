import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CourseBuilderPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Course Builder</h1>
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Assemble reels into courses with quizzes and certificates.</p>
            <Button className="mt-4">Create Course</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
