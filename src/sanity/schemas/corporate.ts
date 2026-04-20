import { defineField, defineType } from "sanity";

export const corporateSchema = defineType({
  name:  "corporate",
  title: "Corporate Partner",
  type:  "document",
  fields: [
    defineField({
      name:       "name",
      title:      "Company Name",
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
      name:  "industry",
      title: "Industry",
      type:  "string",
      description: "e.g. 'Aerospace', 'Healthcare', 'BFSI'",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "industry", media: "logo" },
  },
});
