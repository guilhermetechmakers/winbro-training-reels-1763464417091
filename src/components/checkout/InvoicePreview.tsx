import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";
import type { InvoicePreview } from "@/lib/api/checkout";
import { motion } from "motion/react";

interface InvoicePreviewProps {
  invoice: InvoicePreview | null;
  isLoading?: boolean;
}

export function InvoicePreview({ invoice, isLoading }: InvoicePreviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoice Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoice Preview
          </CardTitle>
          <CardDescription>Review your order summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Plan</span>
              <span className="font-medium">{invoice.planName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Billing Period</span>
              <span className="font-medium">{invoice.billingPeriod}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">
                {invoice.currency} {invoice.subtotal.toFixed(2)}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{invoice.currency} {invoice.discount.toFixed(2)}</span>
              </div>
            )}
            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Tax</span>
                <span className="text-text-secondary">
                  {invoice.currency} {invoice.tax.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {invoice.currency} {invoice.total.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
