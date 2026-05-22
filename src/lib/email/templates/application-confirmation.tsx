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

export interface ApplicationConfirmationEmailProps {
  applicantName: string;
  email:         string;
  startupName:   string;
  program:       string;
  sector:        string;
  stage:         string;
  submittedAt:   string; // human-readable, e.g. "21 May 2026, 12:10 PM"
}

/* ─── Template ──────────────────────────────────────────────────────────── */

export default function ApplicationConfirmationEmail({
  applicantName = "Founder",
  email         = "",
  startupName   = "Your Startup",
  program       = "Core Incubation",
  sector        = "—",
  stage         = "—",
  submittedAt   = "",
}: ApplicationConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Application Received — JSS STEP will review your submission within 7–10 business days.
      </Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>JSS STEP</Heading>
            <Text style={tagline}>Incubation Portal</Text>
          </Section>

          {/* Main */}
          <Section style={main}>
            <Heading as="h2" style={h2}>Application Received ✓</Heading>

            <Text style={greeting}>Hi {applicantName},</Text>
            <Text style={bodyText}>
              Thank you for applying to the JSS STEP Incubation Programme. We have successfully
              received your application and our screening committee will review it shortly.
            </Text>

            {/* Application summary card */}
            <Section style={card}>
              <Row>
                <Column style={cardLabel}>Applicant</Column>
                <Column style={cardValue}>{applicantName}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Email</Column>
                <Column style={cardValue}>{email}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Startup</Column>
                <Column style={cardValue}>{startupName}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Program</Column>
                <Column style={cardValue}>{program}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Sector</Column>
                <Column style={cardValue}>{sector}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Stage</Column>
                <Column style={cardValue}>{stage}</Column>
              </Row>
              {submittedAt && (
                <>
                  <Hr style={cardDivider} />
                  <Row>
                    <Column style={cardLabel}>Submitted</Column>
                    <Column style={cardValue}>{submittedAt}</Column>
                  </Row>
                </>
              )}
            </Section>

            <Text style={bodyText}>
              Our team will assess your application and reach out within{" "}
              <strong>7–10 business days</strong>. If you have not heard from us
              after this period, please check your spam folder or write to us directly.
            </Text>

            <Text style={bodyText}>
              Questions?{" "}
              <a href="mailto:info@jssstepnoida.org" style={link}>
                info@jssstepnoida.org
              </a>
            </Text>

            <Text style={bodyText}>
              Best regards,
              <br />
              <strong>JSS STEP Admissions Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} JSS Science and Technology Entrepreneurship Park.
              All rights reserved.
            </Text>
            <Text style={footerText}>
              JSS Technical Institutions Campus, Noida, Uttar Pradesh
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
  maxWidth: "560px",
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
  margin: "0 0 20px",
};
const greeting: React.CSSProperties = {
  color: "#334155",
  fontSize: "15px",
  margin: "0 0 8px",
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
  margin: "20px 0",
};
const cardLabel: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  width: "90px",
  paddingRight: "12px",
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
const link: React.CSSProperties = {
  color: "#06B6D4",
  textDecoration: "underline",
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
  margin: "0 0 4px",
  lineHeight: "1.6",
};
