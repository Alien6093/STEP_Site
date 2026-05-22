import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

/* ─── Props ─────────────────────────────────────────────────────────────── */

export interface ApplicationInternalNotificationEmailProps {
  applicantName:    string;
  email:            string;
  phone:            string;
  linkedin:         string;
  affiliation:      string;
  orgName:          string;
  startupName:      string;
  targetMarket:     string;
  teamSize:         string;
  stage:            string;
  sector:           string;
  isRegistered:     string;
  problemStatement: string;
  proposedSolution: string;
  program:          string;
  existingFunding:  string;
  heardFrom:        string;
  additionalInfo:   string;
  submittedAt:      string;
}

/* ─── Template ──────────────────────────────────────────────────────────── */

export default function ApplicationInternalNotificationEmail({
  applicantName    = "Unknown",
  email            = "",
  phone            = "",
  linkedin         = "",
  affiliation      = "",
  orgName          = "",
  startupName      = "",
  targetMarket     = "",
  teamSize         = "",
  stage            = "",
  sector           = "",
  isRegistered     = "",
  problemStatement = "",
  proposedSolution = "",
  program          = "",
  existingFunding  = "",
  heardFrom        = "",
  additionalInfo   = "",
  submittedAt      = "",
}: ApplicationInternalNotificationEmailProps) {

  /* Helper — renders a labelled row with optional null guard */
  function Row2({ label, value }: { label: string; value: string }) {
    return (
      <>
        <Row>
          <Column style={cardLabel}>{label}</Column>
          <Column style={cardValue}>{value || "—"}</Column>
        </Row>
        <Hr style={cardDivider} />
      </>
    );
  }

  return (
    <Html lang="en">
      <Head />
      <Preview>
        New incubation application — {applicantName} ({startupName}) · {program}
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>JSS STEP</Heading>
            <Text style={tagline}>New Incubation Application</Text>
          </Section>

          {/* Main */}
          <Section style={main}>
            <Heading as="h2" style={h2}>New Application Received</Heading>

            <Text style={bodyText}>
              A new incubation application has been submitted via the JSS STEP portal.
              Full details are below. Please review and schedule a screening call within
              the 7–10 business day SLA.
            </Text>

            {/* ── Section 1: Personal ── */}
            <Text style={sectionLabel}>Personal Information</Text>
            <Section style={card}>
              <Row2 label="Name"        value={applicantName} />
              <Row2 label="Email"       value={email} />
              <Row2 label="Phone"       value={phone} />
              <Row2 label="LinkedIn"    value={linkedin} />
              <Row2 label="Affiliation" value={affiliation} />
              <Row2 label="Org / College" value={orgName} />
            </Section>

            {/* ── Section 2: Startup ── */}
            <Text style={sectionLabel}>Startup Details</Text>
            <Section style={card}>
              <Row2 label="Startup Name"    value={startupName} />
              <Row2 label="Target Market"   value={targetMarket} />
              <Row2 label="Team Size"       value={teamSize} />
              <Row2 label="Stage"           value={stage} />
              <Row2 label="Sector"          value={sector} />
              <Row2 label="Registered?"     value={isRegistered} />
            </Section>

            {/* ── Problem + Solution (full-width text) ── */}
            <Text style={sectionLabel}>Problem &amp; Solution</Text>
            <Section style={card}>
              <Text style={fieldLabel}>Problem Statement</Text>
              <Text style={fieldBody}>{problemStatement}</Text>
              <Hr style={cardDivider} />
              <Text style={fieldLabel}>Proposed Solution</Text>
              <Text style={fieldBody}>{proposedSolution}</Text>
            </Section>

            {/* ── Section 3: Program ── */}
            <Text style={sectionLabel}>Program &amp; Extras</Text>
            <Section style={card}>
              <Row2 label="Program"    value={program} />
              <Row2 label="Funding"    value={existingFunding} />
              <Row2 label="Heard From" value={heardFrom} />
              {additionalInfo && (
                <>
                  <Text style={fieldLabel}>Additional Info</Text>
                  <Text style={fieldBody}>{additionalInfo}</Text>
                </>
              )}
            </Section>

            <Text style={{ ...bodyText, fontSize: "12px", color: "#94A3B8", marginTop: "24px" }}>
              Submitted at: {submittedAt}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated internal notification from the JSS STEP portal.
              Do not reply to this email.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────── */

const body: React.CSSProperties = {
  backgroundColor: "#F1F5F9",
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};
const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};
const header: React.CSSProperties = {
  backgroundColor: "#0F172A",
  padding: "28px 32px",
  textAlign: "center",
};
const logo: React.CSSProperties = {
  color: "#06B6D4",
  fontSize: "26px",
  fontWeight: 800,
  letterSpacing: "-0.5px",
  margin: 0,
};
const tagline: React.CSSProperties = {
  color: "#64748B",
  fontSize: "12px",
  margin: "4px 0 0",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
const main: React.CSSProperties = { padding: "32px" };
const h2: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 16px",
};
const sectionLabel: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  margin: "24px 0 8px",
};
const bodyText: React.CSSProperties = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};
const card: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "0 0 8px",
};
const cardLabel: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  width: "110px",
  paddingRight: "12px",
  verticalAlign: "top",
  paddingTop: "2px",
};
const cardValue: React.CSSProperties = {
  color: "#1E293B",
  fontSize: "14px",
  fontWeight: 500,
};
const cardDivider: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "10px 0",
};
const fieldLabel: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  margin: "0 0 6px",
};
const fieldBody: React.CSSProperties = {
  color: "#1E293B",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0 0 8px",
  whiteSpace: "pre-wrap",
};
const footer: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  borderTop: "1px solid #E2E8F0",
  padding: "20px 32px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  margin: 0,
  lineHeight: "1.6",
};
