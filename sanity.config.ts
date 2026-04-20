import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset, apiVersion } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas/schema";

export default defineConfig({
  /**
   * basePath must match the Next.js route where NextStudio is mounted.
   * In this project: src/app/studio/[[...index]]/page.tsx
   */
  basePath: "/studio",

  projectId,
  dataset,
  apiVersion,

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  /* Show readable names instead of raw type names in the document pane */
  document: {
    productionUrl: async (_, { document }) => {
      const slug = (document as { slug?: { current?: string } }).slug?.current;
      if (!slug) return undefined;
      const type = document._type;
      if (type === "mentor")    return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/mentors/${slug}`;
      if (type === "portfolio") return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portfolio/${slug}`;
      return undefined;
    },
  },
});
