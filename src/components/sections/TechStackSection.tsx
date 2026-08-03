import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiNetlify,
  SiCloudflare,
  SiOpenaigym,
  SiGooglegemini,
  SiRazorpay,
  SiStripe,
  SiFigma,
  SiGit,
  SiGithub,
  SiFlutter
} from "react-icons/si";
import { Bot, Database, Cloud, CreditCard, Code2, Monitor, Palette, Server, Smartphone, Wrench } from "lucide-react";
import { TbBrandReactNative } from "react-icons/tb";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Tech data — all skills and technologies with icons, names, and brand colors
// ─────────────────────────────────────────────────────────────────────────────
interface Tech {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ElementType<any>;
  color: string;
  darkColor?: string;
}

interface TechCategory {
  label: string;
  icon: React.ElementType;
  techs: Tech[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    label: "Languages",
    icon: Code2,
    techs: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    ],
  },
  {
    label: "Frontend",
    icon: Monitor,
    techs: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#888", darkColor: "#fff" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vite", icon: SiVite, color: "#646CFF" },
    ],
  },
  {
    label: "Backend",
    icon: Server,
    techs: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#888", darkColor: "#fff" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Firestore", icon: SiFirebase, color: "#FFCA28" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
    ],
  },
  {
    label: "Cloud & Infra",
    icon: Cloud,
    techs: [
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
      { name: "Vercel", icon: SiVercel, color: "#888", darkColor: "#fff" },
      { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
      { name: "Cloudflare", icon: SiCloudflare, color: "#F38020" },
    ],
  },
  {
    label: "Mobile",
    icon: Smartphone,
    techs: [
      { name: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    ],
  },
  {
    label: "Design & Payments",
    icon: Palette,
    techs: [
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "Razorpay", icon: SiRazorpay, color: "#02042B", darkColor: "#3395FF" },
      { name: "Stripe", icon: SiStripe, color: "#635BFF" },
    ],
  },
  {
    label: "DevOps & CI/CD",
    icon: Wrench,
    techs: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#888", darkColor: "#fff" },
    ],
  },
  {
    label: "AI & LLMs",
    icon: Bot,
    techs: [
      { name: "OpenAI", icon: SiOpenaigym, color: "#412991", darkColor: "#fff" },
      { name: "Google Gemini", icon: SiGooglegemini, color: "#8E75B2", darkColor: "#8E75B2" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Single technology card
// ─────────────────────────────────────────────────────────────────────────────
function TechCard({ tech, delay, isDark }: { tech: Tech; delay: number; isDark?: boolean }) {
  const color = isDark && tech.darkColor ? tech.darkColor : tech.color;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-1.5 pr-4 rounded-full",
        "border border-border/40 bg-surface",
        "hover:border-primary/30 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300 cursor-default hover:-translate-y-[2px] hover:scale-[1.02]",
      )}
    >
      {/* Icon wrapper with glow on hover */}
      <div
        className="relative flex items-center justify-center w-9 h-9 rounded-full shadow-sm"
        style={{ backgroundColor: `${color}15` }}
      >
        <tech.icon
          className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
          style={{ color }}
        />
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: `${color}25` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
        {tech.name}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category block
// ─────────────────────────────────────────────────────────────────────────────
function CategoryBlock({ category, blockDelay }: { category: TechCategory; blockDelay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: blockDelay }}
      className="flex flex-col h-full p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-surface/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300"
    >
      {/* Category header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary shrink-0"
          aria-hidden="true"
        >
          <category.icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          {category.label}
        </p>
      </div>
      {/* Tech cards grid */}
      <div className="flex flex-wrap gap-2">
        {category.techs.map((tech, i) => (
          <TechCard key={tech.name} tech={tech} delay={blockDelay + i * 0.035} />
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// All-techs marquee strip (mobile friendly horizontal scroll)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TECHS_FLAT = TECH_CATEGORIES.flatMap((c) => c.techs);

function TechMarqueeStrip() {
  // Duplicate for seamless loop
  const items = [...ALL_TECHS_FLAT, ...ALL_TECHS_FLAT];

  return (
    <div className="relative overflow-hidden py-8" aria-hidden="true">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-linear-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-linear-to-l from-background to-transparent pointer-events-none" />

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          animation: marquee-scroll 35s linear infinite;
        }
      `}</style>

      <div className="flex flex-nowrap gap-4 min-w-max items-center animate-marquee-scroll will-change-transform">
        {items.map((tech, i) => {
          const color = tech.color;
          return (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/20 bg-secondary/10 text-sm text-muted-foreground shrink-0 shadow-sm transition-colors hover:bg-surface"
            >
              <tech.icon className="h-4 w-4 shrink-0" style={{ color }} />
              <span className="font-semibold">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function TechStackSection() {
  const activeCategories = TECH_CATEGORIES.filter(c => c.techs.length > 0);
  return (
    <section className="section-y overflow-hidden">
      <div className="container-custom">
        <SectionHeader
          badge="Tech Stack"
          title="Our tech stack: React, TypeScript, and modern cloud engineering"
          description="We engineer secure, scalable, and high-performance products using modern architectures and industry-standard frameworks."
          centered
          className="mb-4"
        />

        {/* Animated marquee strip — all techs at a glance */}
        <div className="mb-16 -mx-4 px-4">
          <TechMarqueeStrip />
        </div>

        {/* Detailed category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCategories.map((category, i) => (
            <CategoryBlock key={category.label} category={category} blockDelay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
