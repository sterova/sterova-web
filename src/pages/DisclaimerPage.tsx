import { SITE } from "@/data/constants";

export default function DisclaimerPage() {
  return (
    <>
      <section className="pt-36 pb-24">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Disclaimer</h1>
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
              <h2>1. General Information Only</h2>
              <p>
                The information published on the {SITE.name} website ({SITE.url}) is provided for general informational purposes only. It is not intended to constitute professional advice of any kind — including legal, financial, technical, or business advice.
              </p>
              <p>
                While we make every effort to keep information current and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information contained on it.
              </p>
            </section>

            <section>
              <h2>2. No Professional Relationship</h2>
              <p>
                Reading content on this website does not create a client relationship between you and {SITE.name}. A professional engagement only begins upon execution of a written agreement.
              </p>
            </section>

            <section>
              <h2>3. Technical Content</h2>
              <p>
                Blog posts, whitepapers, and other technical content on this website represent the opinions and experiences of the authors at the time of writing. The software landscape changes rapidly — content may become outdated. Always evaluate technical decisions in the context of your specific requirements, and consult qualified professionals where appropriate.
              </p>
            </section>

            <section>
              <h2>4. Portfolio and Case Studies</h2>
              <p>
                Project descriptions, outcomes, and metrics published on this website are presented with client permission and reflect the specific circumstances of each engagement. Past results do not guarantee future outcomes. Individual project results will vary based on scope, industry, team, and market conditions.
              </p>
            </section>

            <section>
              <h2>5. External Links</h2>
              <p>
                This website may contain links to third-party websites. These links are provided for convenience only. {SITE.name} has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section>
              <h2>6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, {SITE.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this website or its content.
              </p>
            </section>

            <section>
              <h2>7. Intellectual Property</h2>
              <p>
                All content on this website — including text, graphics, logos, and code — is the intellectual property of {SITE.name} unless otherwise stated. You may not reproduce, distribute, or use any content without written permission, except for personal, non-commercial use.
              </p>
            </section>

            <section>
              <h2>8. Changes</h2>
              <p>
                We may update this Disclaimer from time to time. Changes will be published here with an updated date.
              </p>
            </section>

            <section>
              <h2>9. Contact</h2>
              <p>
                Questions about this Disclaimer? Contact us at:{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
