export const resolveProjectImage = (slug: string) => {
  const projectImages = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/projects/*.{jpeg,jpg,png,gif,svg}"
  );

  const projectImageFn = projectImages[`/src/assets/projects/${slug}.svg`];

  return projectImageFn ? projectImageFn() : null;
};
