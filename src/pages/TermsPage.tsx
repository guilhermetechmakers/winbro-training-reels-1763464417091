import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-text-secondary">
                These terms of service govern your use of Winbro Training Reels.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
