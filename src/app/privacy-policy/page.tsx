import type { Metadata } from "next";
import Link from "next/link";

/* ─── Metadata ─────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for JSS STEP Incubator — how we collect, use, and protect " +
    "your personal data under the Digital Personal Data Protection Act 2023.",
  alternates: { canonical: "/privacy-policy" },
};

/* ─── Section helper ───────────────────────────────────────────────────── */

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-baseline gap-3">
        <span className="text-cyan-600 font-mono text-base">{num}</span>
        {title}
      </h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function PrivacyPolicyPage() {
  const effective = "22 May 2026";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ── */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">
            Effective Date: <span className="text-slate-200">{effective}</span>
            &ensp;·&ensp;
            Governed by the{" "}
            <span className="text-slate-200">
              Digital Personal Data Protection Act 2023 (DPDP Act)
            </span>
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Quick-nav */}
        <nav
          aria-label="Page contents"
          className="mb-12 p-5 rounded-2xl bg-slate-50 border border-slate-200"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Contents
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-cyan-700">
            {[
              ["#controller",    "Data Fiduciary"],
              ["#collection",    "Data We Collect"],
              ["#purpose",       "Purpose of Processing"],
              ["#legal-basis",   "Legal Basis"],
              ["#retention",     "Retention"],
              ["#rights",        "Your Rights as Data Principal"],
              ["#disclosure",    "Disclosure to Third Parties"],
              ["#security",      "Security Safeguards"],
              ["#cookies",       "Cookies & Analytics"],
              ["#children",      "Children's Data"],
              ["#changes",       "Changes to This Policy"],
              ["#contact",       "Contact & Grievance Redressal"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-cyan-500 transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">

          <p className="text-slate-600 leading-relaxed">
            JSS Science and Technology Entrepreneurship Park (&quot;
            <strong>JSS STEP</strong>&quot;, &quot;<strong>we</strong>&quot;,
            &quot;<strong>us</strong>&quot;, or &quot;<strong>our</strong>&quot;) is
            a DST‑supported Technology Business Incubator operating under JSS Academy
            of Technical Education, C‑20/1, Sector 62, Noida, Uttar Pradesh — 201301,
            India. We are committed to protecting your personal data and to complying
            with the{" "}
            <strong>Digital Personal Data Protection Act 2023</strong> (&quot;DPDP Act&quot;)
            and all applicable Indian data protection legislation.
          </p>

          {/* 1 */}
          <Section id="controller" num="01" title="Data Fiduciary">
            <p>
              For the purposes of the DPDP Act 2023, the <strong>Data Fiduciary</strong>{" "}
              responsible for your personal data is:
            </p>
            <address className="not-italic bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
              <strong>JSS STEP Incubator</strong><br />
              JSS Academy of Technical Education<br />
              C‑20/1, Sector 62, Noida, Uttar Pradesh — 201301<br />
              India<br />
              Email:{" "}
              <a
                href="mailto:info@jssstepnoida.in"
                className="text-cyan-600 hover:underline"
              >
                info@jssstepnoida.in
              </a>
            </address>
          </Section>

          {/* 2 */}
          <Section id="collection" num="02" title="Data We Collect">
            <p>
              We collect personal data <strong>only for the purposes described in
              this Policy</strong>. The categories of data we collect include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Identity Data:</strong> Full name, founder/co-founder names,
                organisation name, startup name, and team composition.
              </li>
              <li>
                <strong>Contact Data:</strong> Email address, phone number, and
                LinkedIn profile URL.
              </li>
              <li>
                <strong>Startup Data:</strong> Sector, development stage, target
                market, problem statement, proposed solution, and existing funding
                details submitted via our incubation application form.
              </li>
              <li>
                <strong>Documents:</strong> Pitch deck files (PDF format, max 5 MB)
                uploaded during the application process and stored in Supabase
                Storage (&quot;pitch_decks&quot; bucket).
              </li>
              <li>
                <strong>Account Data:</strong> Supabase Auth-managed user accounts —
                email address and encrypted password hash (we never store passwords
                in plain text).
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device
                identifiers, page visit timestamps, and anonymised usage analytics
                collected by Vercel Analytics.
              </li>
            </ul>
            <p className="text-sm">
              We do <strong>not</strong> collect special categories of personal data
              (e.g., biometric, health, financial account, or caste information) unless
              explicitly disclosed and consented to.
            </p>
          </Section>

          {/* 3 */}
          <Section id="purpose" num="03" title="Purpose of Processing">
            <p>Your data is used exclusively for the following purposes:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                <strong>Application Review:</strong> Evaluating incubation applications
                and pitch decks by the JSS STEP screening committee.
              </li>
              <li>
                <strong>Communication:</strong> Sending confirmation receipts,
                screening updates, and programme-related notifications.
              </li>
              <li>
                <strong>Incubation Operations:</strong> Managing accepted startups&apos;
                mentorship schedules, facility bookings, and programme deliverables.
              </li>
              <li>
                <strong>Legal & Compliance:</strong> Fulfilling obligations under DST
                NIDHI guidelines, the Companies Act 2013, and other applicable law.
              </li>
              <li>
                <strong>Analytics:</strong> Understanding aggregate site usage to improve
                the platform (no individual profiling).
              </li>
            </ol>
            <p className="text-sm">
              We will <strong>not</strong> sell, rent, or commercially exploit your
              personal data to any third party.
            </p>
          </Section>

          {/* 4 */}
          <Section id="legal-basis" num="04" title="Legal Basis for Processing">
            <p>
              Under the DPDP Act 2023, we process your personal data on the following
              legal bases:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Consent (Section 6):</strong> You provide explicit, free,
                specific, and informed consent at the point of submitting your
                application (the DPDP Act checkbox on the application form).
              </li>
              <li>
                <strong>Legitimate Use (Section 7):</strong> Processing necessary to
                perform the incubation services you have applied for and to comply
                with DST/NIDHI reporting obligations.
              </li>
            </ul>
          </Section>

          {/* 5 */}
          <Section id="retention" num="05" title="Data Retention">
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Unsuccessful applications:</strong> Retained for 12 months
                from the date of submission, then securely deleted.
              </li>
              <li>
                <strong>Accepted startups&apos; data:</strong> Retained for the
                duration of the incubation programme plus 7 years (statutory
                accounting record requirement).
              </li>
              <li>
                <strong>Pitch decks:</strong> Deleted from Supabase Storage on
                written request (see Section 06) or automatically purged 24 months
                after submission for unsuccessful applicants.
              </li>
              <li>
                <strong>Analytics data:</strong> Aggregated and anonymised within
                90 days; individual session data is not retained.
              </li>
            </ul>
          </Section>

          {/* 6 */}
          <Section id="rights" num="06" title="Your Rights as Data Principal">
            <p>
              Under the DPDP Act 2023 (Sections 11–14), you have the following rights
              with respect to your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Right to Access (Section 11):</strong> Request a summary of
                the personal data we hold about you and how it is being processed.
              </li>
              <li>
                <strong>Right to Correction (Section 12):</strong> Request correction
                of inaccurate or incomplete personal data.
              </li>
              <li>
                <strong>Right to Erasure (Section 12):</strong> Request deletion of
                your personal data, including your pitch deck file, where we have no
                legal obligation to retain it.
              </li>
              <li>
                <strong>Right to Grievance Redressal (Section 13):</strong> Raise a
                complaint with our Data Protection Officer if you believe your rights
                have been violated.
              </li>
              <li>
                <strong>Right to Nominate (Section 14):</strong> Nominate another
                individual to exercise your rights in the event of your death or
                incapacity.
              </li>
            </ul>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-sm">
              <strong>To exercise any of the above rights</strong>, including requesting
              the deletion of your pitch deck or application data, contact our Data
              Fiduciary at{" "}
              <a
                href="mailto:info@jssstepnoida.in"
                className="text-cyan-600 hover:underline font-medium"
              >
                info@jssstepnoida.in
              </a>{" "}
              with the subject line <em>&quot;DPDP Data Request&quot;</em>. We will
              respond within <strong>30 days</strong> as required by the Act.
            </div>
          </Section>

          {/* 7 */}
          <Section id="disclosure" num="07" title="Disclosure to Third Parties">
            <p>
              We share personal data only with the following categories of processors,
              who are bound by data processing agreements:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Supabase Inc.:</strong> Authentication, database (PostgreSQL),
                and file storage. Data is hosted in AWS ap-south-1 (Mumbai) or nearest
                available Indian region.
              </li>
              <li>
                <strong>Sanity.io:</strong> Content management for public-facing pages
                (startup profiles, events). Only publicly submitted content is stored.
              </li>
              <li>
                <strong>Resend Inc.:</strong> Transactional email delivery for
                application confirmations and notifications.
              </li>
              <li>
                <strong>Vercel Inc.:</strong> Web hosting and edge network delivery.
                Anonymised analytics only.
              </li>
              <li>
                <strong>DST / NIDHI Programme Office:</strong> Aggregate, anonymised
                reporting as required by our grant conditions. No individual personal
                data is shared.
              </li>
            </ul>
            <p className="text-sm">
              We do not transfer personal data outside India except where the above
              processors maintain India-region infrastructure. Where cross-border
              transfers occur, they are governed by standard contractual clauses.
            </p>
          </Section>

          {/* 8 */}
          <Section id="security" num="08" title="Security Safeguards">
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>All data in transit is encrypted using TLS 1.2+.</li>
              <li>Database and storage at rest are AES-256 encrypted by Supabase.</li>
              <li>
                Pitch deck files are stored in a <strong>private</strong> Supabase
                storage bucket — only accessible by authenticated JSS STEP staff via
                service-role signed URLs.
              </li>
              <li>
                Passwords are never stored in plain text; Supabase Auth uses bcrypt
                hashing with salting.
              </li>
              <li>
                API endpoints enforce server-side authentication via JWT verification
                on every request (no client-trusted auth).
              </li>
              <li>
                Application submissions are rate-limited (3 per user per hour) to
                prevent abuse.
              </li>
            </ul>
          </Section>

          {/* 9 */}
          <Section id="cookies" num="09" title="Cookies & Analytics">
            <p>
              This site uses a <strong>minimal cookie footprint</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Strictly necessary:</strong> Supabase authentication session
                cookies (httpOnly, secure, SameSite=Lax). Cannot be opted out of
                while using the portal.
              </li>
              <li>
                <strong>Analytics:</strong> Vercel Analytics collects anonymised page
                view data with no cross-site tracking and no personally identifiable
                information. You may opt out via our cookie banner.
              </li>
            </ul>
            <p className="text-sm">
              We do <strong>not</strong> use advertising cookies, social media pixels,
              or any form of behavioural tracking.
            </p>
          </Section>

          {/* 10 */}
          <Section id="children" num="10" title="Children's Data">
            <p>
              Our services are directed at entrepreneurs and professionals. We do not
              knowingly collect personal data from individuals under 18 years of age
              without verifiable parental or guardian consent. If you believe we have
              inadvertently collected such data, please contact us immediately at{" "}
              <a href="mailto:info@jssstepnoida.in" className="text-cyan-600 hover:underline">
                info@jssstepnoida.in
              </a>
              .
            </p>
          </Section>

          {/* 11 */}
          <Section id="changes" num="11" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy to reflect changes in our data
              practices or applicable law. Material changes will be notified to
              registered users via email at least <strong>14 days</strong> before
              they take effect. Continued use of our services after the effective
              date constitutes acceptance of the updated Policy.
            </p>
            <p className="text-sm text-slate-500">
              Last updated: {effective}
            </p>
          </Section>

          {/* 12 */}
          <Section id="contact" num="12" title="Contact & Grievance Redressal">
            <p>
              For any privacy-related queries, data requests, or complaints under the
              DPDP Act 2023, contact our designated Grievance Officer:
            </p>
            <address className="not-italic bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
              <strong>Grievance Officer — JSS STEP</strong><br />
              JSS Academy of Technical Education<br />
              C‑20/1, Sector 62, Noida, Uttar Pradesh — 201301<br />
              Email:{" "}
              <a
                href="mailto:info@jssstepnoida.in"
                className="text-cyan-600 hover:underline"
              >
                info@jssstepnoida.in
              </a><br />
              Response SLA: <strong>30 days</strong> from receipt of request
            </address>
            <p className="text-sm">
              If your complaint is not resolved to your satisfaction, you may escalate
              it to the{" "}
              <strong>Data Protection Board of India</strong> once constituted under
              the DPDP Act 2023, or approach a court of competent jurisdiction.
            </p>
          </Section>

        </div>

        {/* ── Footer ── */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} JSS STEP. All rights reserved.</p>
          <Link
            href="/"
            className="text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
