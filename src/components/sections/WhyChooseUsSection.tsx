import SectionHeader from "@/components/shared/SectionHeader";
import {
  Rocket,
  Palette,
  Smartphone,
  Search,
  Sparkles,
  LifeBuoy,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const reasons = [
  {
    title: "Fast Delivery",
    description: "Rapid development cycles without compromising on quality or performance.",
    icon: Rocket,
  },
  {
    title: "Modern UI/UX",
    description: "Engaging and intuitive interfaces designed to captivate your audience.",
    icon: Palette,
  },
  {
    title: "Mobile-First Design",
    description: "Flawless experiences across all devices, starting from the smallest screens.",
    icon: Smartphone,
  },
  {
    title: "SEO Optimized",
    description: "Built-in best practices to ensure your digital presence ranks highly.",
    icon: Search,
  },
  {
    title: "AI Integration",
    description: "Leveraging cutting-edge AI to automate and enhance your business processes.",
    icon: Sparkles,
  },
  {
    title: "Ongoing Support",
    description: "Dedicated maintenance and updates to keep your solutions running smoothly.",
    icon: LifeBuoy,
  },
  {
    title: "Secure Development",
    description: "Robust security measures implemented from day one to protect your data.",
    icon: ShieldCheck,
  },
  {
    title: "Scalable Solutions",
    description: "Architectures designed to grow seamlessly with your business needs.",
    icon: TrendingUp,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="section-y relative overflow-hidden bg-accent/20">
      <div className="container-custom">
        <SectionHeader
          badge="Why Sterova"
          title="Why choose Sterova as your software development partner"
          description="We don't just build software. We build advantages for your business."
          centered
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold tracking-tight">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
