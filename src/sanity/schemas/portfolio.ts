import { defineField, defineType } from "sanity";

/**
 * Portfolio startup document schema.
 * Each portfolio entry maps to a card on the /portfolio page.
 */
export const portfolioSchema = defineType({
  name: "portfolio",
  title: "Portfolio Startup",
  type: "document",
  fields: [
    defineField({
      name: "isFeatured",
      title: "⭐ Star / Feature on Homepage",
      type: "boolean",
      description: "Turn this on to display this startup on the main landing page.",
      initialValue: false,
    }),
    defineField({
      name: "startupName",
      title: "Startup Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "startupName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "founderLinkedin",
      title: "Founder LinkedIn URL",
      type: "url",
      description: "Link to the primary founder's LinkedIn profile",
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      description: "e.g. 'AI / ML', 'CleanTech', 'HealthTech'",
    }),
    defineField({
      name: "currentStage",
      title: "Current Stage",
      type: "string",
      description: "e.g., Idea, Prototype, MVP, Seed, Pre-Series A",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "keyHighlight",
      title: "Key Highlight / Achievement",
      type: "string",
      description: "e.g., 'Raised 1Cr Seed Fund' or '10k Active Users'",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "Active" },
          { title: "Acquired", value: "Acquired" },
          { title: "Alumni", value: "Alumni" },
          { title: "Dead", value: "Dead" },
        ],
        layout: "radio",
      },
      initialValue: "Active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cohortYear",
      title: "Cohort Year",
      type: "number",
      description: "e.g. 2024",
    }),
  ],

  preview: {
    select: {
      title: "startupName",
      subtitle: "sector",
      media: "logo",
    },
  },
});