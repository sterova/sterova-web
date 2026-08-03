import { SITE } from "@/data/constants";

export default function RefundPolicyPage() {
  return (
    <>
      <section className="pt-36 pb-24">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Refund Policy</h1>
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
              <h2>1. Overview</h2>
              <p>
                At {SITE.name}, we are committed to delivering high-quality software and maintaining
                transparent, fair commercial relationships. This policy describes how refunds and
                cancellations are handled for our project-based and retainer engagements.
              </p>
            </section>

            <section>
              <h2>2. Fixed-Price Projects</h2>
              <p>
                For fixed-scope project engagements, payments are structured in milestones as agreed
                in the project proposal. The following terms apply:
              </p>
              <ul>
                <li>
                  <strong>Deposit (first milestone payment)</strong> — Non-refundable once project
                  work has begun. This covers scoping, architecture, and initial setup work
                  completed before any visible deliverable.
                </li>
                <li>
                  <strong>Subsequent milestones</strong> — Invoiced upon delivery of each agreed
                  milestone. If a milestone is not delivered as specified, we will rework it at no
                  additional cost before the next invoice is raised.
                </li>
                <li>
                  <strong>Final payment</strong> — Due upon project completion and client sign-off.
                  Not refundable after sign-off has been given.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Monthly Retainers</h2>
              <p>Retainer agreements are billed monthly in advance. The following terms apply:</p>
              <ul>
                <li>You may cancel a retainer at any time with 14 days written notice.</li>
                <li>
                  Retainer fees already paid for the current billing period are non-refundable
                  unless Sterova fails to deliver the agreed service level.
                </li>
                <li>
                  Unused hours in a given month do not roll over and are not refunded unless
                  otherwise agreed in writing.
                </li>
              </ul>
            </section>

            <section>
              <h2>4. Project Cancellation by Client</h2>
              <p>If a client cancels a project in progress:</p>
              <ul>
                <li>
                  Work completed and delivered to date is billable at the agreed milestone rate.
                </li>
                <li>Payments already received for delivered milestones are non-refundable.</li>
                <li>
                  Any work-in-progress that cannot be delivered as a standalone deliverable will be
                  invoiced at a prorated rate based on hours worked.
                </li>
                <li>
                  All completed code and assets will be delivered to the client at cancellation.
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Quality Disputes</h2>
              <p>
                If you believe a deliverable does not meet the agreed specification, we ask that you
                raise the issue within 14 days of delivery with a written description of the
                discrepancy. We will:
              </p>
              <ul>
                <li>Acknowledge your concern within 2 business days.</li>
                <li>Provide a remediation plan within 5 business days.</li>
                <li>Complete any rework covered by the original scope at no additional charge.</li>
              </ul>
              <p>
                Refunds for quality disputes are considered case-by-case and are at the discretion
                of Sterova management.
              </p>
            </section>

            <section>
              <h2>6. Exceptional Circumstances</h2>
              <p>
                In the unlikely event that {SITE.name} is unable to complete a project due to
                circumstances on our end, we will provide a prorated refund for any work paid for
                but not delivered.
              </p>
            </section>

            <section>
              <h2>7. Contact</h2>
              <p>
                For refund requests or billing questions, contact us at:{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
