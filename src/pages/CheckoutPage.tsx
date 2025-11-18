import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlanSelector } from "@/components/checkout/PlanSelector";
import { BillingDetailsForm } from "@/components/checkout/BillingDetailsForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { PromoCodeField } from "@/components/checkout/PromoCodeField";
import { InvoicePreview } from "@/components/checkout/InvoicePreview";
import { usePlans, usePaymentMethods, useInvoicePreview, useProcessCheckout } from "@/hooks/use-checkout";
import type { BillingDetails } from "@/lib/api/checkout";

const checkoutSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: savedPaymentMethods = [] } = usePaymentMethods();
  const { data: invoicePreview, isLoading: invoiceLoading } = useInvoicePreview(
    selectedPlanId,
    promoCode
  );
  const processCheckout = useProcessCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const termsAccepted = watch("termsAccepted");

  // Auto-select first plan if available
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      const popularPlan = plans.find((p) => p.popular) || plans[0];
      setSelectedPlanId(popularPlan.id);
    }
  }, [plans, selectedPlanId]);

  const handleBillingSubmit = (data: BillingDetails) => {
    setBillingDetails(data);
  };

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
  };

  const handlePromoCodeValidated = (code: string) => {
    setPromoCode(code);
  };

  const handlePromoCodeRemoved = () => {
    setPromoCode(undefined);
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }

    if (!billingDetails) {
      toast.error("Please complete billing details");
      return;
    }

    if (!paymentData && !selectedPaymentMethodId) {
      toast.error("Please complete payment information");
      return;
    }

    try {
      const result = await processCheckout.mutateAsync({
        planId: selectedPlanId,
        billingDetails,
        paymentMethodId: selectedPaymentMethodId || undefined,
        promoCode,
        termsAccepted: formData.termsAccepted,
      });

      if (result) {
        setTransactionId(result.transactionId);
        setShowSuccess(true);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                  <p className="text-text-secondary">
                    Your subscription has been activated successfully.
                  </p>
                  {transactionId && (
                    <p className="text-sm text-text-secondary mt-2">
                      Transaction ID: {transactionId}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/transactions")}
                    className="flex-1"
                  >
                    View Transactions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-text-secondary">Complete your subscription purchase</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selector */}
            {plansLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PlanSelector
                plans={plans}
                selectedPlanId={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
              />
            )}

            {/* Billing Details */}
            <BillingDetailsForm 
              onSubmit={handleBillingSubmit}
              onFormChange={(isValid, data) => {
                if (isValid && data) {
                  setBillingDetails(data);
                }
              }}
            />

            {/* Payment Form */}
            <PaymentForm
              savedMethods={savedPaymentMethods}
              onSelectSavedMethod={setSelectedPaymentMethodId}
              onSubmit={handlePaymentSubmit}
              onFormChange={(isValid, data) => {
                if (isValid && data) {
                  setPaymentData(data);
                }
              }}
            />

            {/* Promo Code */}
            <Card>
              <CardContent className="pt-6">
                <PromoCodeField
                  onCodeValidated={handlePromoCodeValidated}
                  onCodeRemoved={handlePromoCodeRemoved}
                  currentCode={promoCode}
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      {...register("termsAccepted")}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="text-sm text-destructive mt-2">
                      {errors.termsAccepted.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={processCheckout.isPending || !termsAccepted}
                  >
                    {processCheckout.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Purchase"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Invoice Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <InvoicePreview invoice={invoicePreview || null} isLoading={invoiceLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
