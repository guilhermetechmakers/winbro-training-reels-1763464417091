import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionHistoryPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>
        <Card>
          <CardHeader>
            <CardTitle>Invoices & Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">View and manage your invoices and payment history.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
