import Image from "next/image";
import { Linkedin } from "lucide-react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Sanity type ─────────────────────────────────────────────────────── */

interface SanityTeamMember {
  _id:        string;
  name:       string;
  role:       string;
  bio:        string | null;
  photo:      { asset: { _ref: string } } | null;
  linkedinUrl: string | null;
  order:      number | null;
}

/* ─── GROQ ────────────────────────────────────────────────────────────── */

const TEAM_QUERY = `
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    photo,
    linkedinUrl,
    order
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

/** Uppercase initials from a full name (max 2 chars) */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic gradient per member (cycles through a palette) */
const GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-rose-500",
];
function gradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

/* ─── Card ────────────────────────────────────────────────────────────── */

function TeamCard({
  member,
  index,
}: {
  member: SanityTeamMember;
  index:  number;
}) {
  const photoUrl = member.photo
    ? urlFor(member.photo)
        .width(400)
        .height(400)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const memberInitials = initials(member.name);
  const grad           = gradient(index);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-slate-50
                 border border-slate-200 cursor-pointer
                 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300"
    >
      {/* Photo / fallback */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-200">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top grayscale group-hover:grayscale-0
                       transition-all duration-500 ease-in-out"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center
                        bg-gradient-to-br ${grad}`}
            aria-hidden
          >
            <span className="text-7xl font-black text-white/40 select-none">
              {memberInitials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-3 items-center text-center">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-slate-900 leading-tight">
            {member.name}
          </h3>
          <p className="text-xs font-semibold text-cyan-600 mt-0.5">{member.role}</p>
        </div>

        {member.bio && (
          <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
        )}

        {/* LinkedIn — only rendered when URL exists */}
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400
                       hover:text-cyan-600 transition-colors duration-200 mt-1 w-fit"
          >
            <Linkedin size={14} />
            LinkedIn Profile
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────── */

export default async function TeamGrid() {
  const team = await client.fetch<SanityTeamMember[]>(
    TEAM_QUERY,
    {},
    { cache: "no-store" }
  );

  return (
    <section
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="team-heading"
    >
      <div className="max-w-5xl mx-auto">

        <ScrollFadeIn>
          <SectionHeading
            label="Leadership"
            title={<span id="team-heading">Meet Our Core Team</span>}
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {team.length === 0 ? (
          /* Graceful empty state while Studio is being populated */
          <p className="text-center text-sm text-slate-400 py-16">
            Team profiles coming soon.
          </p>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto
              ${team.length <= 2 ? "max-w-3xl" : "max-w-5xl lg:grid-cols-3"}`}
          >
            {team.map((member, i) => (
              <ScrollFadeIn key={member._id} delay={i * 0.12}>
                <TeamCard member={member} index={i} />
              </ScrollFadeIn>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
