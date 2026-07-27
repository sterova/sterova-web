import { SITE } from "@/data/constants";

export default function TermsPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="container-custom max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing this website, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you disagree with any part of these terms, please
              do not use our website.
            </p>
          </section>

          <section>
            <h2>2. Use of Website</h2>
            <p>
              This website is provided for informational purposes about {SITE.name}&apos;s software
              development services. You may use this site to learn about our services and contact us
              for project inquiries.
            </p>
          </section>

          <section>
            <h2>3. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and code — is the property
              of {SITE.name} and is protected by applicable intellectual property laws. You may not
              reproduce or distribute our content without written permission.
            </p>
          </section>

          <section>
            <h2>4. Disclaimer of Warranties</h2>
            <p>
              This website is provided &ldquo;as is&rdquo; without any warranties, express or implied.
              We do not warrant that the website will be uninterrupted, error-free, or free of viruses.
            </p>
          </section>

          <section>
            <h2>5. External Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the
              content or privacy practices of those sites.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {SITE.name} shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your
              use of this website.
            </p>
          </section>

          <section>
            <h2>7. Project Agreements</h2>
            <p>
              Software development projects are governed by separate written agreements. These Terms
              of Service apply to website use only, not to project delivery, payment, or intellectual
              property ownership (which are covered in project-specific contracts).
            </p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of our website
              after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by applicable laws. Disputes will be resolved through
              good-faith negotiation before resorting to formal proceedings.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
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
