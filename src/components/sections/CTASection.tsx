import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";

interface Props {
  title?: string;
  description?: string;
}

export default function CTASection({
  title = "Ready to build something great?",
  description = "Start a conversation — describe your project and we'll get back to you within 24 hours with a clear plan.",
}: Props) {
  const waUrl = getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to discuss a project.");

  return (
    <section className="py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#7c3aed] p-10 md:p-16 text-center"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 bg-hero-grid opacity-10"
            aria-hidden="true"
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight text-balance">
              {title}
            </h2>
            <p className="text-[#c7d2fe] text-lg max-w-xl mx-auto mb-10 text-pretty">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="xl"
                className="bg-white text-[#4338ca] hover:bg-[#eef2ff] font-semibold group w-full sm:w-auto border-transparent"
              >
                <Link href="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="ghost"
                className="border border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
