import { defineField, defineType } from "sanity";

/**
 * Portfolio startup document schema.
 * Each portfolio entry maps to a card on the /portfolio page.
 */
export const portfolioSchema = defineType({
  name:  "portfolio",
  title: "Portfolio Startup",
  type:  "document",
  fields: [
    defineField({
      name:  "startupName",
      title: "Startup Name",
      type:  "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "slug",
      title: "Slug",
      type:  "slug",
      options: { source: "startupName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "founderNames",
      title: "Founder Name(s)",
      type:  "string",
      description: "Comma-separated list of founders, e.g. 'Aarav Shah, Priya Nair'",
    }),
    defineField({
      name:  "sector",
      title: "Sector",
      type:  "string",
      description: "e.g. 'AI / ML', 'CleanTech', 'HealthTech'",
    }),
    defineField({
      name:  "description",
      title: "Short Description",
      type:  "text",
      rows:  4,
    }),
    defineField({
      name:    "logo",
      title:   "Logo",
      type:    "image",
      options: { hotspot: true },
    }),
    defineField({
      name:  "websiteUrl",
      title: "Website URL",
      type:  "url",
    }),
    defineField({
      name:  "status",
      title: "Status",
      type:  "string",
      options: {
        list: [
          { title: "Active",   value: "Active"   },
          { title: "Acquired", value: "Acquired" },
          { title: "Alumni",   value: "Alumni"   },
          { title: "Dead",     value: "Dead"     },
        ],
        layout: "radio",
      },
      initialValue: "Active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:         "cohortYear",
      title:        "Cohort Year",
      type:         "number",
      description:  "e.g. 2024",
    }),
    defineField({
      name:         "isFeatured",
      title:        "Feature on Homepage",
      type:         "boolean",
      description:  "Toggle on to show this startup in the homepage glimpse (Max 3 recommended)",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title:    "startupName",
      subtitle: "sector",
      media:    "logo",
    },
  },
});
