import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BillingDetails } from "@/lib/api/checkout";

const billingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  taxId: z.string().optional(),
});

type BillingFormData = z.infer<typeof billingSchema>;

interface BillingDetailsFormProps {
  defaultValues?: Partial<BillingDetails>;
  onSubmit: (data: BillingDetails) => void;
  onFormChange?: (isValid: boolean, data?: BillingDetails) => void;
}

export function BillingDetailsForm({ defaultValues, onSubmit, onFormChange }: BillingDetailsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const formData = watch();

  // Notify parent of form validity changes
  React.useEffect(() => {
    if (onFormChange) {
      if (isValid) {
        onFormChange(true, formData as BillingDetails);
      } else {
        onFormChange(false);
      }
    }
  }, [isValid, formData, onFormChange]);

  const onFormSubmit = (data: BillingFormData) => {
    onSubmit(data as BillingDetails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Billing Details
        </CardTitle>
        <CardDescription>Enter your company billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
              <Input
                id="companyName"
                className="pl-10"
                placeholder="Acme Manufacturing Inc."
                {...register("companyName")}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
              <Input
                id="billingAddress"
                className="pl-10"
                placeholder="123 Main Street"
                {...register("billingAddress")}
              />
            </div>
            {errors.billingAddress && (
              <p className="text-sm text-destructive">{errors.billingAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="New York"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="NY"
                {...register("state")}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="United States"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID (Optional)</Label>
            <Input
              id="taxId"
              placeholder="12-3456789"
              {...register("taxId")}
            />
            {errors.taxId && (
              <p className="text-sm text-destructive">{errors.taxId.message}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
