import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/api/checkout";

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
}

export function PlanSelector({ plans, selectedPlanId, onSelectPlan }: PlanSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-text-secondary">Select the subscription plan that best fits your needs</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isSelected = selectedPlanId === plan.id;
          const isPopular = plan.popular;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-200",
                  isSelected && "ring-2 ring-primary shadow-card-hover",
                  isPopular && "border-primary",
                  "hover:shadow-card-hover hover:-translate-y-1"
                )}
                onClick={() => onSelectPlan(plan.id)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-text-secondary ml-2">
                      /{plan.duration === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div
                    className={cn(
                      "w-full py-2 rounded-lg text-center font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    )}
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
