import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Check, ArrowRight, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    {
      title: "Micro-Learning Reels",
      description: "20-30 second video reels for quick, focused training on machine setup and maintenance.",
      icon: Play,
    },
    {
      title: "Time-Synced Transcripts",
      description: "Searchable transcripts with click-to-seek functionality for precise learning.",
      icon: Check,
    },
    {
      title: "Course Builder",
      description: "Assemble reels into comprehensive courses with quizzes and certificates.",
      icon: ArrowRight,
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      features: ["Up to 50 users", "100 reels", "Basic analytics", "Email support"],
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      features: ["Up to 200 users", "Unlimited reels", "Advanced analytics", "Priority support", "Custom branding"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited users", "Unlimited reels", "Full analytics suite", "Dedicated support", "SSO integration", "Custom integrations"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background-surface">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">Winbro Training Reels</h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/help" className="text-text-secondary hover:text-primary transition-colors">
              Help
            </Link>
            <Link to="/login" className="text-text-secondary hover:text-primary transition-colors">
              Login
            </Link>
            <Button asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text-primary">
            Micro-Learning for Manufacturing Excellence
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Transform your training with 20-30 second video reels. Quick, focused, and searchable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setIsVideoModalOpen(true)}>
              <Play className="mr-2 h-5 w-5" />
              Watch Sample Reel
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-background-surface">
        <h2 className="text-4xl font-bold text-center mb-12 text-text-primary">
          Everything You Need for Effective Training
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-text-primary">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className={`card-hover h-full ${plan.popular ? 'border-primary border-2' : ''}`}>
                <CardHeader>
                  {plan.popular && (
                    <span className="badge-published w-fit mb-2">Most Popular</span>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-text-secondary ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-success" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link to="/checkout">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-surface mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Winbro Training Reels</h3>
              <p className="text-text-secondary text-sm">
                Micro-learning platform for manufacturing excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/help" className="hover:text-primary">Help</Link></li>
                <li><Link to="/help" className="hover:text-primary">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-text-secondary text-sm">
                support@winbro.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
            © 2024 Winbro Training Reels. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sample Reel Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sample Training Reel</DialogTitle>
            <DialogDescription>
              Watch a 20-30 second example of our micro-learning format
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-text-secondary">Video player would be embedded here (HLS player)</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
