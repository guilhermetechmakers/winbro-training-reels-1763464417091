import apiClient from '../api';
import type { ApiResponse } from '../api';

// Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface BillingDetails {
  companyName: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  valid: boolean;
  message?: string;
}

export interface InvoicePreview {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  planName: string;
  billingPeriod: string;
}

export interface CheckoutRequest {
  planId: string;
  billingDetails: BillingDetails;
  paymentMethodId?: string;
  promoCode?: string;
  termsAccepted: boolean;
}

export interface CheckoutResponse {
  transactionId: string;
  subscriptionId: string;
  invoiceUrl: string;
  success: boolean;
}

// API Functions
export const checkoutApi = {
  // Get available plans
  getPlans: async (): Promise<ApiResponse<Plan[]>> => {
    try {
      const response = await apiClient.get('/checkout/plans');
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to fetch plans',
      };
    }
  },

  // Validate promo code
  validatePromoCode: async (code: string): Promise<ApiResponse<PromoCode>> => {
    try {
      const response = await apiClient.post('/checkout/validate-promo', { code });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || 'Invalid promo code',
      };
    }
  },

  // Get saved payment methods
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    try {
      const response = await apiClient.get('/checkout/payment-methods');
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to fetch payment methods',
      };
    }
  },

  // Generate invoice preview
  getInvoicePreview: async (
    planId: string,
    promoCode?: string
  ): Promise<ApiResponse<InvoicePreview>> => {
    try {
      const response = await apiClient.post('/checkout/invoice-preview', {
        planId,
        promoCode,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || 'Failed to generate invoice preview',
      };
    }
  },

  // Process checkout
  processCheckout: async (
    checkoutData: CheckoutRequest
  ): Promise<ApiResponse<CheckoutResponse>> => {
    try {
      const response = await apiClient.post('/checkout/process', checkoutData);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || 'Payment processing failed',
      };
    }
  },
};
