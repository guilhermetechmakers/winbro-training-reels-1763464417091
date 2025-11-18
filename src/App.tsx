import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import DashboardPage from "@/pages/DashboardPage";
import ContentLibraryPage from "@/pages/ContentLibraryPage";
import ReelDetailPage from "@/pages/ReelDetailPage";
import UploadReelPage from "@/pages/UploadReelPage";
import EditReelPage from "@/pages/EditReelPage";
import CourseBuilderPage from "@/pages/CourseBuilderPage";
import QuizPage from "@/pages/QuizPage";
import CheckoutPage from "@/pages/CheckoutPage";
import TransactionHistoryPage from "@/pages/TransactionHistoryPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import UserManagementPage from "@/pages/UserManagementPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import HelpPage from "@/pages/HelpPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/library" element={<ContentLibraryPage />} />
          <Route path="/reel/:id" element={<ReelDetailPage />} />
          <Route path="/upload" element={<UploadReelPage />} />
          <Route path="/edit/:id" element={<EditReelPage />} />
          <Route path="/courses" element={<CourseBuilderPage />} />
          <Route path="/quiz/:courseId/:moduleId" element={<QuizPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
      <ShadcnToaster />
    </QueryClientProvider>
  );
}
