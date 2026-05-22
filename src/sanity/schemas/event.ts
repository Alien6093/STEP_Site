import { defineField, defineType } from "sanity";

export const eventSchema = defineType({
  name:  "event",
  title: "Events",
  type:  "document",
  fields: [
    defineField({
      name:       "title",
      title:      "Event Title",
      type:       "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name:  "slug",
      title: "Slug",
      type:  "slug",
      options: { source: "title" },
    }),
    defineField({
      name:       "eventType",
      title:      "Event Type",
      type:       "string",
      options: {
        list: [
          { title: "Workshop",   value: "Workshop"   },
          { title: "Demo Day",   value: "Demo Day"   },
          { title: "Webinar",    value: "Webinar"    },
          { title: "Mixer",      value: "Mixer"      },
          { title: "Conference", value: "Conference" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name:       "date",
      title:      "Event Date",
      type:       "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name:  "time",
      title: "Time (display string, e.g. \"10:00 AM – 1:00 PM\")",
      type:  "string",
    }),
    defineField({
      name:  "venue",
      title: "Venue",
      type:  "string",
    }),
    defineField({
      name:  "description",
      title: "Short Description",
      type:  "text",
      rows:  3,
    }),
    defineField({
      name:  "externalRegistrationUrl",
      title: "External Registration URL",
      type:  "url",
      description: "e.g. Eventbrite / Google Form link. Leave blank for past events.",
    }),
    defineField({
      name:    "isPastEvent",
      title:   "Is Past Event?",
      type:    "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date (newest first)",
      name:  "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title:    "title",
      subtitle: "date",
    },
  },
});
