import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentMethod } from "@/lib/api/checkout";

const paymentSchema = z.object({
  cardNumber: z.string().min(13, "Card number is required").max(19),
  expiryMonth: z.string().min(1, "Month is required"),
  expiryYear: z.string().min(1, "Year is required"),
  cvv: z.string().min(3, "CVV is required").max(4),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  savedMethods?: PaymentMethod[];
  onSelectSavedMethod?: (methodId: string) => void;
  onSubmit: (data: PaymentFormData) => void;
  onFormChange?: (isValid: boolean, data?: PaymentFormData) => void;
}

export function PaymentForm({ savedMethods = [], onSelectSavedMethod, onSubmit, onFormChange }: PaymentFormProps) {
  const [useSavedMethod, setUseSavedMethod] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
  });

  const formData = watch();

  // Notify parent of form validity changes
  useEffect(() => {
    if (onFormChange && !useSavedMethod) {
      if (isValid) {
        onFormChange(true, formData);
      } else {
        onFormChange(false);
      }
    } else if (onFormChange && useSavedMethod && selectedMethodId) {
      onFormChange(true);
    } else if (onFormChange) {
      onFormChange(false);
    }
  }, [isValid, formData, useSavedMethod, selectedMethodId, onFormChange]);

  const onFormSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  const handleSelectSavedMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
    onSelectSavedMethod?.(methodId);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>Enter your payment details securely</CardDescription>
      </CardHeader>
      <CardContent>
        {savedMethods.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="new-card"
                name="payment-method"
                checked={!useSavedMethod}
                onChange={() => {
                  setUseSavedMethod(false);
                  setSelectedMethodId(null);
                }}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="new-card" className="cursor-pointer">
                Use new card
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="saved-card"
                name="payment-method"
                checked={useSavedMethod}
                onChange={() => setUseSavedMethod(true)}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="saved-card" className="cursor-pointer">
                Use saved payment method
              </Label>
            </div>

            {useSavedMethod && (
              <div className="ml-6 space-y-2">
                {savedMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedMethodId === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectSavedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm font-medium">
                          {method.brand} •••• {method.last4}
                        </span>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs text-text-secondary">Default</span>
                      )}
                    </div>
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-xs text-text-secondary mt-1">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!useSavedMethod && (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                {...register("cardholderName")}
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive">{errors.cardholderName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                <Input
                  id="cardNumber"
                  className="pl-10"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  {...register("cardNumber")}
                />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month *</Label>
                <select
                  id="expiryMonth"
                  className="flex h-10 w-full rounded-lg border border-input bg-background-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("expiryMonth")}
                >
                  <option value="">MM</option>
                  {months.map((month) => (
                    <option key={month} value={month.toString().padStart(2, "0")}>
                      {month.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && (
                  <p className="text-sm text-destructive">{errors.expiryMonth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year *</Label>
                <select
                  id="expiryYear"
                  className="flex h-10 w-full rounded-lg border border-input bg-background-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("expiryYear")}
                >
                  <option value="">YYYY</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && (
                  <p className="text-sm text-destructive">{errors.expiryYear.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  {...register("cvv")}
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive">{errors.cvv.message}</p>
                )}
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
