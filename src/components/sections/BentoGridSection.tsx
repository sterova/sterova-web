import { motion } from "framer-motion";
import { Link } from "@/lib/router-compat";
import { ArrowRight, Code2, Globe, Shield, Smartphone, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveStats } from "@/lib/api";
import { PROCESS_STEPS } from "@/data/constants";



export default function BentoGridSection() {
  const { data: stats } = useQuery({
    queryKey: ["site-stats"],
    queryFn: fetchActiveStats,
    staleTime: 5 * 60_000,
  });

  const activeStats = stats?.slice(0, 4) || [];

  return (
    <section className="section-y bg-background">
      <div className="container-custom">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to ship faster
          </h2>
          <p className="text-muted-foreground">
            A proven process, modern tech stack, and a focus on delivering actual business value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-auto">
          
          {/* Box 1: Why Choose Us (Spans 2 columns on tablet/desktop if stats exist) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${activeStats.length > 0 ? "md:col-span-2" : "md:col-span-3"} card-premium p-6 lg:p-8 flex flex-col justify-between`}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 mb-4 border border-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Why Sterova</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-6">Engineered for your advantage</h3>
              
              <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold"><Globe className="h-4 w-4 text-primary"/> Modern Stack</div>
                  <p className="text-sm text-muted-foreground">We use industry standards so your product is scalable and easily maintainable by any team.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold"><Shield className="h-4 w-4 text-primary"/> You Own The Code</div>
                  <p className="text-sm text-muted-foreground">No vendor lock-in. From day one, you have full ownership of the IP and infrastructure.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold"><Code2 className="h-4 w-4 text-primary"/> Direct Access</div>
                  <p className="text-sm text-muted-foreground">Talk directly to the engineers building your product. No layers of account managers.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold"><Smartphone className="h-4 w-4 text-primary"/> Fixed Quotes</div>
                  <p className="text-sm text-muted-foreground">We scope rigorously before starting so you get a predictable budget and timeline.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Box 2: Stats (Compact Stack) */}
          {activeStats.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-premium p-6 lg:p-8 flex flex-col justify-between bg-surface-2 border-primary/10"
            >
              <div>
                <h3 className="font-display text-xl font-bold mb-6">By the numbers</h3>
                <div className="space-y-6">
                  {activeStats.map((stat) => (
                    <div key={stat.id}>
                      <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm font-medium text-foreground">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}



          {/* Box 3: Process Steps (Spans full width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 card-premium p-6 lg:p-10 relative overflow-hidden"
          >
            {/* Subtle background gradient */}
            <div className="absolute right-0 top-0 w-[40%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 relative z-10">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">How we build</h3>
                <p className="text-muted-foreground max-w-xl text-sm">
                  Our proven 6-step delivery process ensures transparency, speed, and high-quality outcomes with zero surprises.
                </p>
              </div>
              <Link href="/process" className="shrink-0 group flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors">
                Detailed process <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="relative z-10">
              {/* Horizontal connecting line for desktop */}
              <div className="absolute top-5 left-5 right-5 h-px bg-border hidden lg:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-4 gap-y-8 lg:gap-y-0">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.number} className="relative group flex gap-4 lg:block">
                    {/* Vertical connecting line for mobile/tablet */}
                    {i !== PROCESS_STEPS.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-[-32px] w-px bg-border lg:hidden" />
                    )}
                    
                    {/* Step Node */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs font-bold text-primary shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:scale-110 lg:mb-5">
                      {step.number}
                    </div>
                    
                    {/* Step Content */}
                    <div className="pt-1.5 lg:pt-0">
                      <div className="font-semibold text-sm mb-1.5 transition-colors group-hover:text-primary">{step.title}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed lg:line-clamp-3">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
