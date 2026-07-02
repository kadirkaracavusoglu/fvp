import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../env";

const builder = imageUrlBuilder({ projectId, dataset });

// source: Sanity image referansı (tip esnek tutuldu)
export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}
