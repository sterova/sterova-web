import type { Metadata } from "next";
import { SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE.name}`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <section className="pt-32 pb-24">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: {year}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2>1. Introduction</h2>
            <p>
              {SITE.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
              is committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website or contact us about our
              services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>
                <strong>Contact information:</strong> name, email address,
                company name, phone number
              </li>
              <li>
                <strong>Project details:</strong> service requirements, budget
                range, project description
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> email address
              </li>
              <li>
                <strong>Job applications:</strong> CV, portfolio, and personal
                information you choose to share
              </li>
            </ul>
            <p>We may also collect:</p>
            <ul>
              <li>
                <strong>Usage data:</strong> pages visited, time spent,
                referring URLs (via analytics)
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser type,
                device information
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and project requests</li>
              <li>Send you project proposals and updates</li>
              <li>Send newsletters (with your consent)</li>
              <li>Process job applications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share it with:
            </p>
            <ul>
              <li>
                Service providers who assist in our operations (e.g., email
                delivery, analytics) under strict data processing agreements
              </li>
              <li>
                Law enforcement or regulatory authorities when required by law
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              provide our services or as required by law. Contact form
              submissions are retained for up to 2 years.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to: access,
              correct, delete, or export your personal data; object to or
              restrict processing; and withdraw consent. Contact us at{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> to exercise
              these rights.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              We use essential cookies to operate our website and analytics
              cookies (with your consent) to understand usage. You can control
              cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify
              you of significant changes by posting the updated policy with a
              new effective date.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or our data
              practices, please contact us at:{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
