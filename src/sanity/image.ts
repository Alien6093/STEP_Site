import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from "./client";

const builder = createImageUrlBuilder(client);

/**
 * urlFor(source).url()   → full CDN URL
 * urlFor(source).width(400).url()  → resized CDN URL
 *
 * @example
 *   <img src={urlFor(mentor.photo).width(200).height(200).url()} />
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
