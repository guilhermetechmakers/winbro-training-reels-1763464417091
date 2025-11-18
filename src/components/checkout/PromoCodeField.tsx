import { useState } from "react";
import { useValidatePromoCode } from "@/hooks/use-checkout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Tag } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface PromoCodeFieldProps {
  onCodeValidated: (code: string) => void;
  onCodeRemoved: () => void;
  currentCode?: string;
}

export function PromoCodeField({ onCodeValidated, onCodeRemoved, currentCode }: PromoCodeFieldProps) {
  const [code, setCode] = useState(currentCode || "");
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCode, setValidatedCode] = useState<string | null>(currentCode || null);
  
  const validateMutation = useValidatePromoCode();

  const handleValidate = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateMutation.mutateAsync(code);
      if (result && result.valid) {
        setValidatedCode(code);
        onCodeValidated(code);
        toast.success(result.message || "Promo code applied successfully!");
      } else {
        toast.error(result?.message || "Invalid promo code");
      }
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setValidatedCode(null);
    onCodeRemoved();
    toast.success("Promo code removed");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="promoCode">Promo Code</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <Input
            id="promoCode"
            className="pl-10"
            placeholder="Enter promo code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={!!validatedCode || isValidating}
          />
        </div>
        <AnimatePresence mode="wait">
          {validatedCode ? (
            <motion.div
              key="remove"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-success" />
                Applied
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="apply"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleValidate}
                disabled={isValidating || !code.trim()}
              >
                {isValidating ? "Validating..." : "Apply"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
