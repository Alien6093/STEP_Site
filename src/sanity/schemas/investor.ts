import { defineField, defineType } from "sanity";

export const investorSchema = defineType({
  name:  "investor",
  title: "Investor",
  type:  "document",
  fields: [
    defineField({
      name:       "name",
      title:      "Investor / Fund Name",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:    "logo",
      title:   "Logo",
      type:    "image",
      options: { hotspot: true },
    }),
    defineField({
      name:       "description",
      title:      "Description",
      type:       "text",
      rows:       3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name:  "websiteUrl",
      title: "Website URL",
      type:  "url",
    }),
    defineField({
      name:  "focusArea",
      title: "Investment Focus / Ticket Size",
      type:  "string",
      description: "e.g. 'Deep Tech · ₹50L–₹5Cr'",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "focusArea", media: "logo" },
  },
});
