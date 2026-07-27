import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Code2, Globe, Smartphone, Layers, Palette, Plug,
  Wrench, LayoutDashboard, Zap, Server, Database,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Layers, Palette, Plug,
  Wrench, LayoutDashboard, Zap, Server, Database,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? Code2;
  return <Icon className="h-6 w-6" />;
}

interface Props {
  services: Service[];
  limit?: number;
  showCta?: boolean;
}

export default function ServicesSection({ services, limit, showCta = true }: Props) {
  const displayed = limit ? services.slice(0, limit) : services;

  if (services.length === 0) {
    return (
      <section id="services" className="py-24 bg-secondary/30">
        <div className="container-custom text-center">
          <p className="text-muted-foreground">Services coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container-custom">
        <SectionHeader
          badge="What We Build"
          title="Services that move businesses forward"
          description="Here's what we're good at. Each service is backed by real project experience — not a capabilities deck."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={`/services#${service.slug}`}
                className={cn(
                  "group flex flex-col h-full rounded-2xl border bg-background p-6",
                  "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300"
                )}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ServiceIcon name={service.icon_name} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.short_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="inline-block text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {showCta && limit && services.length > limit && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/services">
                View all services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
