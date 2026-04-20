import { defineField, defineType } from "sanity";

/**
 * Mentor document schema.
 * Each mentor maps to a bookable profile card on the /mentors listing page
 * and the /mentors/[slug] detail page.
 */
export const mentorSchema = defineType({
  name:  "mentor",
  title: "Mentor",
  type:  "document",
  fields: [
    defineField({
      name:  "name",
      title: "Full Name",
      type:  "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "slug",
      title: "Slug",
      type:  "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "designation",
      title: "Designation",
      type:  "string",
      description: "e.g. 'Co-founder & CEO, NeuraTech'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "organisation",
      title: "Organisation",
      type:  "string",
    }),
    defineField({
      name:  "domain",
      title: "Domain / Expertise",
      type:  "string",
      options: {
        list: [
          { title: "Deep Tech",              value: "deep-tech"         },
          { title: "FinTech",                value: "fintech"           },
          { title: "HealthTech",             value: "healthtech"        },
          { title: "AgriTech",               value: "agritech"          },
          { title: "CleanTech",              value: "cleantech"         },
          { title: "AI / ML",               value: "ai-ml"             },
          { title: "Hardware & IoT",         value: "hardware-iot"      },
          { title: "SaaS / Enterprise Tech", value: "saas"              },
          { title: "Venture & Investment",   value: "venture"           },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name:  "bio",
      title: "Biography",
      type:  "text",
      rows:  6,
    }),
    defineField({
      name:    "photo",
      title:   "Profile Photo",
      type:    "image",
      options: { hotspot: true },
    }),
    defineField({
      name:  "linkedinUrl",
      title: "LinkedIn URL",
      type:  "url",
    }),
    defineField({
      name:         "isAvailableForBooking",
      title:        "Available for Booking",
      type:         "boolean",
      initialValue: true,
    }),

    /* ── Extended profile fields ── */
    defineField({
      name:  "experienceYears",
      title: "Years of Experience",
      type:  "number",
    }),
    defineField({
      name:         "totalSessions",
      title:        "Total Sessions Mentored",
      type:         "number",
      initialValue: 0,
    }),
    defineField({
      name:  "expertise",
      title: "Areas of Expertise",
      type:  "array",
      of:    [{ type: "string" }],
    }),
    defineField({
      name:  "twitterUrl",
      title: "Twitter / X URL",
      type:  "url",
    }),
    defineField({
      name:  "websiteUrl",
      title: "Website URL",
      type:  "url",
    }),
  ],

  preview: {
    select: {
      title:    "name",
      subtitle: "designation",
      media:    "photo",
    },
  },
});
