import { defineField, defineType } from "sanity";

export const partnerSchema = defineType({
  name:  "partner",
  title: "Ecosystem Partner",
  type:  "document",
  fields: [
    defineField({
      name:       "name",
      title:      "Organisation Name",
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
      name:  "partnerType",
      title: "Type of Partnership",
      type:  "string",
      description: "e.g. 'Technology', 'Legal', 'Academic', 'Government'",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "partnerType", media: "logo" },
  },
});
