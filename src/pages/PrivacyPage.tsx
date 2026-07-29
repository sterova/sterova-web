import { SITE } from "@/data/constants";

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-36 pb-24">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-invert prose-headings:font-display max-w-none">
            <section>
              <h2>1. Introduction</h2>
              <p>
                {SITE.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed
                to protecting your privacy. This Privacy Policy explains how we collect, use, and
                safeguard information when you visit our website or engage our services.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Contact information</strong> — name, email address, company name, and
                  phone number when you fill out our contact form.
                </li>
                <li>
                  <strong>Project information</strong> — details about your project scope, timeline,
                  and budget that you share with us voluntarily.
                </li>
                <li>
                  <strong>Usage data</strong> — anonymized analytics data such as pages visited and
                  time spent on the site.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your project inquiries and schedule consultations.</li>
                <li>Provide and improve our software development services.</li>
                <li>Send project-related communications you have requested.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as required by law or necessary to deliver our
                services (e.g., cloud hosting providers under appropriate data processing
                agreements).
              </p>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction.
              </p>
            </section>

            <section>
              <h2>6. Your Rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, or delete your
                personal data. To exercise these rights, contact us at{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
              </p>
            </section>

            <section>
              <h2>7. Cookies</h2>
              <p>
                Our website may use essential cookies for functionality. We do not use advertising
                or cross-site tracking cookies.
              </p>
            </section>

            <section>
              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated date.
              </p>
            </section>

            <section>
              <h2>9. Contact</h2>
              <p>
                For questions about this Privacy Policy, contact us at:{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
