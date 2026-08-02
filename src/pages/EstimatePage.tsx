import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Monitor,
  Smartphone,
  Layers,
  Palette,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Users,
  MessageSquare,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitEstimatorRequest } from "@/lib/estimator-api";

type ProjectType = "web" | "mobile" | "saas" | "design";
type Feature = "auth" | "payments" | "admin" | "realtime" | "api";
type DesignNeed = "existing" | "wireframes" | "full";
type Timeline = "standard" | "expedited";

interface FormData {
  projectType: ProjectType | null;
  features: Feature[];
  design: DesignNeed | null;
  timeline: Timeline | null;
  name: string;
  email: string;
  phone: string;
}

const PROJECT_TYPES = [
  {
    id: "web",
    title: "Web Application",
    icon: Monitor,
    desc: "React, Next.js, full-stack web platforms.",
  },
  {
    id: "mobile",
    title: "Mobile App",
    icon: Smartphone,
    desc: "iOS and Android apps via React Native.",
  },
  { id: "saas", title: "SaaS Product", icon: Layers, desc: "Multi-tenant platforms with billing." },
  {
    id: "design",
    title: "UI/UX Design",
    icon: Palette,
    desc: "Wireframes, high-fidelity design systems.",
  },
] as const;

const FEATURES = [
  {
    id: "auth",
    title: "User Authentication",
    icon: ShieldCheck,
    desc: "Sign in, roles, permissions.",
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: CreditCard,
    desc: "Stripe integration, subscriptions.",
  },
  { id: "admin", title: "Admin Dashboard", icon: Users, desc: "Manage users and internal data." },
  {
    id: "realtime",
    title: "Real-time Features",
    icon: MessageSquare,
    desc: "Chat, live notifications, WebSockets.",
  },
  {
    id: "api",
    title: "3rd-Party APIs",
    icon: Database,
    desc: "Integrate with external tools and CRMs.",
  },
] as const;

const DESIGN_NEEDS = [
  {
    id: "existing",
    title: "I have existing designs",
    desc: "You have Figma or Sketch files ready for development.",
  },
  {
    id: "wireframes",
    title: "I have wireframes",
    desc: "You have a basic layout, but need UI polishing.",
  },
  {
    id: "full",
    title: "I need full UI/UX design",
    desc: "Start from scratch with research and high-fidelity design.",
  },
] as const;

const TIMELINES = [
  {
    id: "standard",
    title: "Standard Timeline",
    desc: "8-12 weeks based on scope. Best for quality.",
    icon: undefined,
  },
  {
    id: "expedited",
    title: "Expedited",
    desc: "4-6 weeks. Requires faster feedback loops.",
    icon: Zap,
  },
] as const;

export default function EstimatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectType: null,
    features: [],
    design: null,
    timeline: null,
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const toggleFeature = (featureId: Feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const calculateEstimate = () => {
    let minCost = 5000;
    let maxCost = 10000;
    let weeks = "4-6";

    if (formData.projectType === "saas") {
      minCost += 10000;
      maxCost += 15000;
      weeks = "8-12";
    } else if (formData.projectType === "mobile") {
      minCost += 8000;
      maxCost += 12000;
      weeks = "8-10";
    } else if (formData.projectType === "design") {
      minCost = 3000;
      maxCost = 7000;
      weeks = "3-5";
    }

    const featureCount = formData.features.length;
    minCost += featureCount * 1500;
    maxCost += featureCount * 2500;

    if (formData.design === "full" && formData.projectType !== "design") {
      minCost += 4000;
      maxCost += 6000;
    }

    if (formData.timeline === "expedited") {
      minCost = Math.floor(minCost * 1.3);
      maxCost = Math.floor(maxCost * 1.3);
    }

    return {
      cost: "$" + (minCost / 1000).toFixed(0) + "k - $" + (maxCost / 1000).toFixed(0) + "k",
      timeline: weeks,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || isSaving) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      await submitEstimatorRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType ?? "unspecified",
        features: formData.features,
        designNeed: formData.design,
        timelinePref: formData.timeline,
        estimateCost: estimate.cost,
        estimateWeeks: estimate.timeline,
      });
      setIsSubmitted(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[100svh] pt-24 pb-12 flex flex-col relative overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-3xl mx-auto px-4 flex-1 flex flex-col relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight">
            Project Estimator
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Answer a few quick questions to get an instant, rough estimate for your custom software
            project.
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex justify-between text-xs font-medium text-muted-foreground mt-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">What type of project are you building?</h2>
                  <p className="text-muted-foreground">Select the primary platform or service.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.projectType === type.id;
                    return (
                      <Card
                        key={type.id}
                        className={cn(
                          "p-5 cursor-pointer transition-all duration-200 border-2 hover:border-primary/50 relative overflow-hidden group",
                          isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card",
                        )}
                        onClick={() =>
                          setFormData({ ...formData, projectType: type.id as ProjectType })
                        }
                      >
                        <div className="flex items-start gap-4 relative z-10">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              isSelected
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {type.desc}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">What core features do you need?</h2>
                  <p className="text-muted-foreground">
                    Select all that apply to your MVP or initial release.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = formData.features.includes(feature.id as Feature);
                    return (
                      <Card
                        key={feature.id}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-200 border hover:border-primary/50",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border/50 bg-card",
                        )}
                        onClick={() => toggleFeature(feature.id as Feature)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-md",
                              isSelected ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                          </div>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input",
                            )}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">What is your design readiness?</h2>
                  <p className="text-muted-foreground">
                    This helps us estimate the UI/UX effort required.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {DESIGN_NEEDS.map((need) => {
                    const isSelected = formData.design === need.id;
                    return (
                      <Card
                        key={need.id}
                        className={cn(
                          "p-5 cursor-pointer transition-all duration-200 border-2 hover:border-primary/50",
                          isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card",
                        )}
                        onClick={() => setFormData({ ...formData, design: need.id as DesignNeed })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">{need.title}</h3>
                            <p className="text-sm text-muted-foreground">{need.desc}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary ml-4 shrink-0" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">What is your ideal timeline?</h2>
                  <p className="text-muted-foreground">
                    Standard development vs expedited sprints.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {TIMELINES.map((time) => {
                    const isSelected = formData.timeline === time.id;
                    return (
                      <Card
                        key={time.id}
                        className={cn(
                          "p-5 cursor-pointer transition-all duration-200 border-2 hover:border-primary/50",
                          isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card",
                        )}
                        onClick={() => setFormData({ ...formData, timeline: time.id as Timeline })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{time.title}</h3>
                              {time.icon && <time.icon className="w-4 h-4 text-amber-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{time.desc}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary ml-4 shrink-0" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && !isSubmitted && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold font-display">Your Estimate is Ready</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Based on your selections, here is a rough estimate of the cost and timeline for
                    your project.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card className="p-6 bg-primary/5 border-primary/20 flex flex-col items-center justify-center text-center">
                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
                      Estimated Cost
                    </span>
                    <span className="text-4xl font-bold text-foreground gradient-text">
                      {estimate.cost}
                    </span>
                  </Card>
                  <Card className="p-6 bg-surface border-border flex flex-col items-center justify-center text-center">
                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
                      Estimated Timeline
                    </span>
                    <span className="text-4xl font-bold text-foreground">{estimate.timeline}</span>
                    <span className="text-muted-foreground mt-1 text-sm">weeks</span>
                  </Card>
                </div>

                <Card className="max-w-xl mx-auto p-6 md:p-8 bg-card shadow-lg border-border/60">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-center mb-6">
                      <h3 className="text-xl font-semibold">Get the Detailed Breakdown</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your email to receive a detailed breakdown of this estimate and next
                        steps.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 00000 00000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    {saveError && (
                      <p
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                      >
                        {saveError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="gradient"
                      disabled={isSaving}
                      className="w-full h-12 text-base"
                    >
                      {isSaving ? "Sending…" : "Send Detailed Estimate"}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === 5 && isSubmitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6 py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold font-display">Check your inbox!</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  We've sent a detailed breakdown of your project estimate to{" "}
                  <strong>{formData.email}</strong>. Our engineering team will be in touch shortly.
                </p>
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => (window.location.href = "/")}
                >
                  Return to Home
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < 5 && (
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 1}
              className={step === 1 ? "opacity-0 pointer-events-none" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              variant="default"
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.projectType) ||
                (step === 3 && !formData.design) ||
                (step === 4 && !formData.timeline)
              }
              className="px-8"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
