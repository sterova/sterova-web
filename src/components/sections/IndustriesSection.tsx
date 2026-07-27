import { motion } from "framer-motion";
import {
  Landmark, HeartPulse, GraduationCap, ShoppingCart, Truck,
  Building2, Factory, UtensilsCrossed, Users,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { INDUSTRIES } from "@/data/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Landmark, HeartPulse, GraduationCap, ShoppingCart, Truck,
  Building2, Factory, UtensilsCrossed, Users,
};

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container-custom">
        <SectionHeader
          badge="Industries"
          title="Trusted across industries"
          description="We've shipped products in these spaces, so we understand the problems before you explain them."
          centered
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {INDUSTRIES.map((industry, i) => {
            const Icon = ICON_MAP[industry.icon_name] ?? Landmark;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border bg-background p-5",
                  "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
                  "transition-all duration-300 cursor-default"
                )}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
