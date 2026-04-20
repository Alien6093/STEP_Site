import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

/* ─── Props ───────────────────────────────────────────────────────────── */

interface AbandonedBookingEmailProps {
  email:      string;
  mentorName: string;
}

/* ─── Template ────────────────────────────────────────────────────────── */

export default function AbandonedBookingEmail({
  email      = "founder@example.com",
  mentorName = "your selected mentor",
}: AbandonedBookingEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>⏳ Your slot with {mentorName} is still open — complete your booking</Preview>

      <Body style={body}>
        <Container style={container}>

          {/* ── Header ── */}
          <Section style={header}>
            <Heading style={logo}>JSS STEP</Heading>
            <Text style={tagline}>Incubation Portal</Text>
          </Section>

          {/* ── Urgency banner ── */}
          <Section style={urgencyBanner}>
            <Text style={urgencyText}>⏳ Slot still reserved for you</Text>
          </Section>

          {/* ── Main ── */}
          <Section style={main}>
            <Heading as="h2" style={h2}>
              Your slot with {mentorName} is still open
            </Heading>

            <Text style={body_text}>
              Hi there,
            </Text>
            <Text style={body_text}>
              You started booking a mentoring session with <strong>{mentorName}</strong> but
              didn&apos;t complete it. Slots fill up fast — your reserved time may not be
              available for long.
            </Text>

            <Text style={body_text}>
              Finish your booking in under 60 seconds:
            </Text>

            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <Button
                href="https://jss-step.in/mentors"
                style={cta}
              >
                Complete My Booking →
              </Button>
            </Section>

            <Text style={note}>
              If you no longer need mentoring support, simply ignore this email.
              No action is required on your part.
            </Text>

            <Text style={body_text}>
              — JSS STEP Team
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footer_text}>
              This email was triggered because {email} started a booking flow on the JSS STEP portal.
            </Text>
            <Text style={footer_text}>
              © {new Date().getFullYear()} JSS Science and Technology Entrepreneurship Park.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────── */

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

const urgencyBanner: React.CSSProperties = {
  backgroundColor: "#FFF7ED",
  borderBottom: "1px solid #FED7AA",
  padding: "10px 32px",
  textAlign: "center",
};

const urgencyText: React.CSSProperties = {
  color: "#C2410C",
  fontSize: "13px",
  fontWeight: 600,
  margin: 0,
};

const main: React.CSSProperties = {
  padding: "32px",
};

const h2: React.CSSProperties = {
  color: "#0F172A",
  fontSize: "20px",
  fontWeight: 700,
  margin: "0 0 20px",
  lineHeight: "1.3",
};

const body_text: React.CSSProperties = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 14px",
};

const cta: React.CSSProperties = {
  backgroundColor: "#06B6D4",
  borderRadius: "10px",
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: 700,
  padding: "13px 28px",
  textDecoration: "none",
  display: "inline-block",
};

const note: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};

const footer: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  borderTop: "1px solid #E2E8F0",
  padding: "20px 32px",
  textAlign: "center",
};

const footer_text: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  margin: "0 0 4px",
  lineHeight: "1.6",
};
