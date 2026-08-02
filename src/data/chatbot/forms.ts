import type { FormDefinition } from "./types";

/**
 * Scripted, stepwise data-collection flows. The engine asks one step at a
 * time, validates the answer locally, and only submits once every required
 * step is complete.
 */

export const LEAD_FORM: FormDefinition = {
  id: "lead",
  title: "Request a Quote",
  intro:
    "Happy to help. I'll ask a few short questions so the team can prepare an accurate proposal — it takes about a minute.",
  steps: [
    {
      id: "name",
      prompt: "First up — what's your name?",
      placeholder: "Your full name",
      type: "text",
      validate: "nonEmpty",
    },
    {
      id: "email",
      prompt: "Thanks! What email should we send the proposal to?",
      placeholder: "you@company.com",
      type: "email",
      validate: "email",
    },
    {
      id: "phone",
      prompt: "A phone number, in case a quick call is faster? (optional)",
      placeholder: "+00 00000 00000",
      type: "tel",
      optional: true,
      validate: "phone",
    },
    {
      id: "company",
      prompt: "What's your company or project called? (optional)",
      placeholder: "Company or project name",
      type: "text",
      optional: true,
    },
    {
      id: "service",
      prompt: "Which service are you interested in?",
      placeholder: "Choose a service",
      type: "choice",
      choices: [
        "Custom Software Development",
        "Web Application Development",
        "Mobile App Development",
        "UI/UX Design",
        "Not sure yet",
      ],
    },
    {
      id: "timeline",
      prompt: "When would you like to get started?",
      placeholder: "Choose a timeline",
      type: "choice",
      choices: ["As soon as possible", "Within 1 month", "In 1–3 months", "Just exploring"],
    },
    {
      id: "message",
      prompt: "Finally — tell me a little about the project.",
      placeholder: "What are you building, and what problem should it solve?",
      type: "textarea",
      validate: "nonEmpty",
    },
  ],
  successMessages: [
    "Thank you — your request has been sent to the Sterova team. ✅",
    "We typically respond within one business day with next steps and a tailored proposal.",
  ],
  successActions: [
    { kind: "whatsapp", label: "Message on WhatsApp", icon: "FaWhatsapp" },
    { kind: "node", label: "Explore Portfolio", node: "portfolio", icon: "Briefcase" },
    { kind: "home", label: "Main Menu", icon: "Home" },
  ],
};

export const CONSULTATION_FORM: FormDefinition = {
  id: "consultation",
  title: "Book a Consultation",
  intro:
    "Let's get a call in the diary. A consultation is a free 30-minute conversation about your goals and the best way to reach them.",
  steps: [
    {
      id: "name",
      prompt: "What's your name?",
      placeholder: "Your full name",
      type: "text",
      validate: "nonEmpty",
    },
    {
      id: "email",
      prompt: "And your email for the calendar invite?",
      placeholder: "you@company.com",
      type: "email",
      validate: "email",
    },
    {
      id: "phone",
      prompt: "A contact number for the call?",
      placeholder: "+00 00000 00000",
      type: "tel",
      validate: "phone",
    },
    {
      id: "topic",
      prompt: "What would you like to discuss?",
      placeholder: "Choose a topic",
      type: "choice",
      choices: [
        "New project discovery",
        "Existing product improvements",
        "Technical / architecture advice",
        "Design review",
        "Something else",
      ],
    },
    {
      id: "date",
      prompt: "Which date suits you best?",
      placeholder: "Pick a date",
      type: "date",
      validate: "date",
    },
    {
      id: "time",
      prompt: "And roughly what time?",
      placeholder: "Pick a time",
      type: "time",
      validate: "time",
    },
    {
      id: "notes",
      prompt: "Anything you'd like us to prepare beforehand? (optional)",
      placeholder: "Context, links, questions…",
      type: "textarea",
      optional: true,
    },
  ],
  successMessages: [
    "Your consultation request is booked in. 📅",
    "We'll confirm the exact slot by email shortly. If anything changes, just reply to that email.",
  ],
  successActions: [
    { kind: "whatsapp", label: "Message on WhatsApp", icon: "FaWhatsapp" },
    { kind: "node", label: "See our Process", node: "process", icon: "Settings2" },
    { kind: "home", label: "Main Menu", icon: "Home" },
  ],
};

export const FORMS = {
  lead: LEAD_FORM,
  consultation: CONSULTATION_FORM,
} as const;

export const FORM_VALIDATION_MESSAGES: Record<string, string> = {
  email: "That doesn't look like a valid email address — could you check it?",
  phone: "That number doesn't look right. Please include the country code if you can.",
  nonEmpty: "Could you give me a little more detail there?",
  date: "Please choose a valid date.",
  time: "Please choose a valid time.",
};

export const FORM_CANCEL_MESSAGE =
  "No problem — I've stopped that form. Nothing was sent. What else can I help with?";
