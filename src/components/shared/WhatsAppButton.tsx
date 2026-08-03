import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { useBrandLinks } from "@/hooks/use-brand-links";

export default function WhatsAppButton() {
  const { whatsappHref } = useBrandLinks();

  return (
    // Sits above the chatbot launcher, which owns the bottom-right corner.
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3 sm:right-6">
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-whatsapp hover:bg-brand-whatsapp-hover text-brand-whatsapp-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
      </motion.a>
    </div>
  );
}
