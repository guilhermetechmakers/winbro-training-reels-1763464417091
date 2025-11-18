import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quiz</h1>
        <Card>
          <CardHeader>
            <CardTitle>Module Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Take the quiz to complete this module.</p>
            <Button className="mt-4">Start Quiz</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
