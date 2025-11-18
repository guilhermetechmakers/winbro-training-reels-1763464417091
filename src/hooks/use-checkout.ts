import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { checkoutApi, type CheckoutRequest, type CheckoutResponse } from '@/lib/api/checkout';

// Query keys
export const checkoutKeys = {
  all: ['checkout'] as const,
  plans: () => [...checkoutKeys.all, 'plans'] as const,
  paymentMethods: () => [...checkoutKeys.all, 'payment-methods'] as const,
  invoicePreview: (planId: string, promoCode?: string) => 
    [...checkoutKeys.all, 'invoice-preview', planId, promoCode] as const,
};

// Get plans
export function usePlans() {
  return useQuery({
    queryKey: checkoutKeys.plans(),
    queryFn: async () => {
      const result = await checkoutApi.getPlans();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get payment methods
export function usePaymentMethods() {
  return useQuery({
    queryKey: checkoutKeys.paymentMethods(),
    queryFn: async () => {
      const result = await checkoutApi.getPaymentMethods();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });
}

// Validate promo code
export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async (code: string) => {
      const result = await checkoutApi.validatePromoCode(code);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid promo code');
    },
  });
}

// Get invoice preview
export function useInvoicePreview(planId: string | null, promoCode?: string) {
  return useQuery({
    queryKey: checkoutKeys.invoicePreview(planId || '', promoCode),
    queryFn: async () => {
      if (!planId) return null;
      const result = await checkoutApi.getInvoicePreview(planId, promoCode);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!planId,
  });
}

// Process checkout
export function useProcessCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkoutData: CheckoutRequest): Promise<CheckoutResponse> => {
      const result = await checkoutApi.processCheckout(checkoutData);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('Checkout failed');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutKeys.all });
      toast.success('Payment processed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment processing failed');
    },
  });
}
