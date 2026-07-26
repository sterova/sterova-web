import type { Metadata } from "next";
import { SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE.name}`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <section className="pt-32 pb-24">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-10">Last updated: {year}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the {SITE.name} website and services
              (&quot;Services&quot;), you agree to be bound by these Terms of
              Service. If you do not agree, please do not use our Services.
            </p>
          </section>

          <section>
            <h2>2. Services Description</h2>
            <p>
              {SITE.name} provides software development, design, and technology
              consulting services. Specific terms for individual projects are
              governed by separate project agreements or statements of work.
            </p>
          </section>

          <section>
            <h2>3. Use of Website</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Submit false or misleading information</li>
              <li>
                Scrape, crawl, or systematically extract data without
                permission
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos,
              and code — is the property of {SITE.name} and protected by
              applicable intellectual property laws. You may not reproduce or
              distribute our content without prior written permission.
            </p>
          </section>

          <section>
            <h2>5. Confidentiality</h2>
            <p>
              Information you share with us about your project or business is
              treated as confidential. We sign NDAs upon request before
              detailed technical discussions.
            </p>
          </section>

          <section>
            <h2>6. Disclaimer of Warranties</h2>
            <p>
              Our website is provided &quot;as is&quot; without warranties of
              any kind. We do not guarantee that the website will be
              uninterrupted, error-free, or free of viruses.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {SITE.name} shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of this website.
            </p>
          </section>

          <section>
            <h2>8. Project Agreements</h2>
            <p>
              Software development projects are governed by separate written
              agreements. These Terms of Service apply to website use only, not
              to project delivery, payment, or intellectual property ownership
              (which are covered in project-specific contracts).
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued
              use of our website after changes constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by applicable laws. Disputes will be
              resolved through good-faith negotiation before resorting to formal
              proceedings.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For questions about these Terms, contact us at:{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
