import { SITE } from "@/data/constants";

export default function CookiePolicyPage() {
  return (
    <>
      <section className="pt-36 pb-24">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-12">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-invert prose-headings:font-display max-w-none">
            <section>
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small text files placed on your device when you visit a website. They help the site remember information about your visit — like your preferences or session state — so it works better for you on your next visit.
              </p>
            </section>

            <section>
              <h2>2. How We Use Cookies</h2>
              <p>The {SITE.name} website uses a minimal set of cookies:</p>
              <ul>
                <li>
                  <strong>Essential cookies</strong> — Required for the site to function. These include session management, CSRF protection, and theme preference. They cannot be turned off.
                </li>
                <li>
                  <strong>Functional cookies</strong> — Remember your preferences (such as dark/light mode) to improve your experience. These persist across sessions.
                </li>
              </ul>
              <p>
                We do <strong>not</strong> use advertising cookies, cross-site tracking cookies, or third-party analytics platforms that fingerprint individual users.
              </p>
            </section>

            <section>
              <h2>3. Specific Cookies We Set</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>sterova-theme</code></td>
                    <td>Stores your dark/light mode preference</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td><code>sterova-chat-transcript</code></td>
                    <td>Saves your chatbot conversation for 6 hours</td>
                    <td>Session (6h)</td>
                  </tr>
                  <tr>
                    <td><code>sb-*</code></td>
                    <td>Supabase authentication session (admin only)</td>
                    <td>Session</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2>4. Third-Party Cookies</h2>
              <p>
                We do not load any third-party scripts that set their own cookies on first page load. If you interact with embedded content or external links, those third parties may set their own cookies subject to their own policies.
              </p>
            </section>

            <section>
              <h2>5. Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Most browsers allow you to view, delete, and block cookies. Note that disabling essential cookies may affect how the site functions.
              </p>
              <p>
                Useful links for managing cookies in common browsers:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer">Edge</a></li>
              </ul>
            </section>

            <section>
              <h2>6. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy when we change the cookies we use. Changes will be reflected here with an updated date.
              </p>
            </section>

            <section>
              <h2>7. Contact</h2>
              <p>
                Questions about our use of cookies? Contact us at:{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
