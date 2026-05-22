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

/* ─── Props ───────────────────────────────────────────────────────────── */

interface MentorNotificationEmailProps {
  mentorName:  string;
  founderName: string;   // user's email prefix (e.g. "arjun" from arjun@gmail.com)
  founderEmail:string;   // full user email — so mentor can reach out
  startupName: string;
  startupStage:string | null;
  topic:       string | null;
  date:        string;   // human-readable, e.g. "Wed, 23 Apr 2026"
  time:        string;   // e.g. "10:00:00"
}

/* ─── Template ────────────────────────────────────────────────────────── */

export default function MentorNotificationEmail({
  mentorName   = "Mentor",
  founderName  = "Founder",
  founderEmail = "",
  startupName  = "Their Startup",
  startupStage = null,
  topic        = null,
  date         = "Wednesday, 23 Apr 2026",
  time         = "10:00:00",
}: MentorNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New booking from {founderName} ({startupName}) — {time} on {date}</Preview>

      <Body style={body}>
        <Container style={container}>

          {/* ── Header ── */}
          <Section style={header}>
            <Heading style={logo}>JSS STEP</Heading>
            <Text style={tagline}>Mentor Notification</Text>
          </Section>

          {/* ── Main ── */}
          <Section style={main}>
            <Heading as="h2" style={h2}>New Session Booking</Heading>

            <Text style={greeting}>Hi {mentorName},</Text>
            <Text style={body_text}>
              A founder has booked a mentoring session with you through the JSS STEP portal.
              Their details are below.
            </Text>

            {/* Session + founder summary card */}
            <Section style={card}>
              <Row>
                <Column style={cardLabel}>Date</Column>
                <Column style={cardValue}>{date}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Time</Column>
                <Column style={cardValue}>{time}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Founder</Column>
                <Column style={cardValue}>{founderName}</Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Email</Column>
                <Column style={cardValue}>
                  <a href={`mailto:${founderEmail}`} style={link}>{founderEmail}</a>
                </Column>
              </Row>
              <Hr style={cardDivider} />
              <Row>
                <Column style={cardLabel}>Startup</Column>
                <Column style={cardValue}>{startupName}</Column>
              </Row>
              {startupStage && (
                <>
                  <Hr style={cardDivider} />
                  <Row>
                    <Column style={cardLabel}>Stage</Column>
                    <Column style={cardValue}>{startupStage}</Column>
                  </Row>
                </>
              )}
              {topic && (
                <>
                  <Hr style={cardDivider} />
                  <Row>
                    <Column style={cardLabel}>Topic</Column>
                    <Column style={cardValue}>{topic}</Column>
                  </Row>
                </>
              )}
            </Section>

            <Text style={body_text}>
              The session is 60 minutes via video call. You may reach the founder directly
              at <a href={`mailto:${founderEmail}`} style={link}>{founderEmail}</a> if you
              need to coordinate a meeting link or reschedule.
            </Text>

            <Text style={body_text}>
              Thank you for mentoring JSS STEP's deep-tech cohort.<br />
              <strong>JSS STEP Team</strong>
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footer_text}>
              © {new Date().getFullYear()} JSS Science and Technology Entrepreneurship Park.
              All rights reserved.
            </Text>
            <Text style={footer_text}>
              JSS Technical Institutions Campus, Mysuru, Karnataka — 570006
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

const body_text: React.CSSProperties = {
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

const footer_text: React.CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  margin: "0 0 4px",
  lineHeight: "1.6",
};
