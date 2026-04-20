import { defineField, defineType } from "sanity";

/**
 * Team Member document schema.
 * Each entry maps to a card in the "Meet Our Core Team" section on /about.
 */
export const teamSchema = defineType({
  name:  "teamMember",
  title: "Team Member",
  type:  "document",
  fields: [
    defineField({
      name:       "name",
      title:      "Full Name",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:       "role",
      title:      "Designation / Role",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:       "bio",
      title:      "Short Bio",
      type:       "text",
      rows:       3,
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name:    "photo",
      title:   "Profile Photo",
      type:    "image",
      options: { hotspot: true },
    }),
    defineField({
      name:  "linkedinUrl",
      title: "LinkedIn Profile URL",
      type:  "url",
    }),
    defineField({
      name:         "order",
      title:        "Display Order",
      type:         "number",
      description:  "Lower numbers appear first (e.g., CEO = 1)",
      initialValue: 99,
    }),
  ],

  orderings: [
    {
      title: "Display Order",
      name:  "orderAsc",
      by:    [{ field: "order", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title:    "name",
      subtitle: "role",
      media:    "photo",
    },
  },
});
