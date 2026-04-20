import { notFound } from "next/navigation";
import { client }   from "@/sanity/client";
import { urlFor }   from "@/sanity/image";
import MentorProfileClient, {
  type MentorProfileData,
} from "./MentorProfileClient";

/* ─── GROQ query ──────────────────────────────────────────────────────── */

const MENTOR_QUERY = `
  *[_type == "mentor" && slug.current == $slug][0] {
    _id,
    name,
    designation,
    organisation,
    bio,
    photo,
    linkedinUrl,
    twitterUrl,
    websiteUrl,
    experienceYears,
    totalSessions,
    "expertise": coalesce(expertise, []),
    isAvailableForBooking
  }
`;

/* ─── Sanity result shape ─────────────────────────────────────────────── */

interface SanityMentorDetail {
  _id:                  string;
  name:                 string;
  designation:          string | null;
  organisation:         string | null;
  bio:                  string | null;
  photo:                { asset: { _ref: string } } | null;
  linkedinUrl:          string | null;
  twitterUrl:           string | null;
  websiteUrl:           string | null;
  experienceYears:      number | null;
  totalSessions:        number | null;
  expertise:            string[];
  isAvailableForBooking: boolean;
}

/* ─── Metadata ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mentor = await client.fetch<SanityMentorDetail | null>(
    MENTOR_QUERY,
    { slug },
    { next: { revalidate: 3600 } }
  );

  if (!mentor) {
    return { title: "Mentor not found — JSS STEP" };
  }

  return {
    title:       `${mentor.name} — JSS STEP Mentors`,
    description: mentor.bio?.slice(0, 160) ?? `Book a session with ${mentor.name} on JSS STEP.`,
  };
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /* Next.js 15+: params is a Promise — must be awaited */
  const { slug } = await params;

  const mentor = await client.fetch<SanityMentorDetail | null>(
    MENTOR_QUERY,
    { slug },
    { next: { revalidate: 3600 } }
  );

  if (!mentor) notFound();

  /* Resolve photo URL server-side so the Client Component receives a plain string */
  const photoUrl = mentor.photo
    ? urlFor(mentor.photo).width(224).height(224).fit("crop").auto("format").url()
    : null;

  const mentorData: MentorProfileData = {
    _id:                  mentor._id,
    name:                 mentor.name,
    designation:          mentor.designation,
    organisation:         mentor.organisation,
    bio:                  mentor.bio,
    photoUrl,
    linkedinUrl:          mentor.linkedinUrl,
    twitterUrl:           mentor.twitterUrl,
    websiteUrl:           mentor.websiteUrl,
    experienceYears:      mentor.experienceYears,
    totalSessions:        mentor.totalSessions,
    expertise:            mentor.expertise,
    isAvailableForBooking: mentor.isAvailableForBooking,
  };

  return <MentorProfileClient mentor={mentorData} />;
}
