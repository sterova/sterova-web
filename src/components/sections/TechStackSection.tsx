import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiVite,
  SiNodedotjs, SiExpress, SiPostgresql, SiSupabase, SiMongodb, SiRedis,
  SiVercel, SiCloudflare, SiFirebase, SiDocker,
  SiExpo, SiFlutter,
  SiJavascript, SiPython, SiGo,
  SiFigma, SiStripe,
  SiGit, SiGithub, SiGithubactions,
  SiLangchain, SiOpenaigym,
  SiGraphql,
  SiLinux,
  SiPrisma,
  SiDrizzle,
  SiKubernetes,
  SiNginx,
  SiSentry,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
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
  emoji: string;
  techs: Tech[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    label: "Frontend",
    emoji: "🖥️",
    techs: [
      { name: "React",        icon: SiReact,       color: "#61DAFB" },
      { name: "Next.js",      icon: SiNextdotjs,   color: "#888", darkColor: "#fff" },
      { name: "TypeScript",   icon: SiTypescript,  color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vite",         icon: SiVite,        color: "#646CFF" },
      { name: "JavaScript",   icon: SiJavascript,  color: "#F7DF1E" },
    ],
  },
  {
    label: "Backend",
    emoji: "⚙️",
    techs: [
      { name: "Node.js",    icon: SiNodedotjs,  color: "#339933" },
      { name: "Express",    icon: SiExpress,    color: "#888", darkColor: "#fff" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
      { name: "Supabase",   icon: SiSupabase,   color: "#3ECF8E" },
      { name: "MongoDB",    icon: SiMongodb,    color: "#47A248" },
      { name: "Redis",      icon: SiRedis,      color: "#DC382D" },
      { name: "GraphQL",    icon: SiGraphql,    color: "#E10098" },
      { name: "Prisma",     icon: SiPrisma,     color: "#2D3748", darkColor: "#CBD5E0" },
      { name: "Drizzle",    icon: SiDrizzle,    color: "#C5F74F", darkColor: "#C5F74F" },
    ],
  },
  {
    label: "Cloud & Infra",
    emoji: "☁️",
    techs: [
      { name: "Vercel",      icon: SiVercel,     color: "#888", darkColor: "#fff" },
      { name: "Cloudflare",  icon: SiCloudflare, color: "#F38020" },
      { name: "Firebase",    icon: SiFirebase,   color: "#FFCA28" },
      { name: "Docker",      icon: SiDocker,     color: "#2496ED" },
      { name: "AWS",         icon: FaAws,        color: "#FF9900" },
      { name: "Kubernetes",  icon: SiKubernetes, color: "#326CE5" },
      { name: "Nginx",       icon: SiNginx,      color: "#009639" },
      { name: "Linux",       icon: SiLinux,      color: "#FCC624" },
    ],
  },
  {
    label: "Mobile",
    emoji: "📱",
    techs: [
      { name: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
      { name: "Expo",         icon: SiExpo,             color: "#888", darkColor: "#fff" },
      { name: "Flutter",      icon: SiFlutter,          color: "#02569B" },
    ],
  },
  {
    label: "Languages",
    emoji: "💻",
    techs: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Python",     icon: SiPython,     color: "#3776AB" },
      { name: "Go",         icon: SiGo,         color: "#00ADD8" },
    ],
  },
  {
    label: "Design & Payments",
    emoji: "🎨",
    techs: [
      { name: "Figma",  icon: SiFigma,  color: "#F24E1E" },
      { name: "Stripe", icon: SiStripe, color: "#635BFF" },
    ],
  },
  {
    label: "DevOps & CI/CD",
    emoji: "🔧",
    techs: [
      { name: "Git",            icon: SiGit,           color: "#F05032" },
      { name: "GitHub",         icon: SiGithub,        color: "#888", darkColor: "#fff" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { name: "Sentry",         icon: SiSentry,        color: "#362D59", darkColor: "#8B78D5" },
    ],
  },
  {
    label: "AI & LLMs",
    emoji: "🤖",
    techs: [
      { name: "OpenAI",    icon: SiOpenaigym, color: "#412991", darkColor: "#fff" },
      { name: "LangChain", icon: SiLangchain, color: "#1C3C3C", darkColor: "#3ECF8E" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Single technology card
// ─────────────────────────────────────────────────────────────────────────────
function TechCard({ tech, delay, isDark }: { tech: Tech; delay: number; isDark?: boolean }) {
  const color = isDark && tech.darkColor ? tech.darkColor : tech.color;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.2 } }}
      className={cn(
        "group flex items-center gap-3 p-1.5 pr-4 rounded-full",
        "border border-border/40 bg-secondary/30 backdrop-blur-md",
        "hover:border-primary/30 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300 cursor-default"
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
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
          style={{ backgroundColor: `${color}25` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
        {tech.name}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category block
// ─────────────────────────────────────────────────────────────────────────────
function CategoryBlock({
  category,
  blockDelay,
}: {
  category: TechCategory;
  blockDelay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: blockDelay }}
    >
      {/* Category header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">{category.emoji}</span>
        <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          {category.label}
        </p>
      </div>
      {/* Tech cards grid */}
      <div className="flex flex-wrap gap-2">
        {category.techs.map((tech, i) => (
          <TechCard
            key={tech.name}
            tech={tech}
            delay={blockDelay + i * 0.035}
          />
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
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex flex-nowrap gap-4 min-w-max items-center will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {items.map((tech, i) => {
          const color = tech.color;
          return (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/20 bg-secondary/10 backdrop-blur-sm text-sm text-muted-foreground shrink-0 shadow-sm transition-colors hover:bg-secondary/30"
            >
              <tech.icon className="h-4 w-4 shrink-0" style={{ color }} />
              <span className="font-semibold">{tech.name}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function TechStackSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container-custom">
        <SectionHeader
          badge="Tech Stack"
          title="Powered by modern engineering"
          description="We leverage industry-leading frameworks and robust architectures to engineer secure, scalable, and high-performance digital products."
          centered
          className="mb-4"
        />

        {/* Animated marquee strip — all techs at a glance */}
        <div className="mb-16 -mx-4 px-4">
          <TechMarqueeStrip />
        </div>

        {/* Detailed category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
          {TECH_CATEGORIES.map((category, i) => (
            <CategoryBlock
              key={category.label}
              category={category}
              blockDelay={i * 0.07}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
