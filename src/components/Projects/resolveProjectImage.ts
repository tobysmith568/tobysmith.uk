// Returns the resolved image metadata (Vite-processed src + intrinsic size), not an
// astro:assets <Image>-compatible promise - project logos are SVGs, which don't benefit from
// Sharp's resize/recompress, and the Cloudflare adapter's runtime image service (what powers
// <Image> in `astro dev` and any non-prerendered request) doesn't support the SVG format at
// all, so routing them through <Image> 400s. Rendered as a plain <img src> instead.
export const resolveProjectImage = async (slug: string): Promise<ImageMetadata | null> => {
  const projectImages = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/projects/*.{jpeg,jpg,png,gif,svg}"
  );

  const projectImageFn = projectImages[`/src/assets/projects/${slug}.svg`];
  if (!projectImageFn) return null;

  const { default: image } = await projectImageFn();
  return image;
};
