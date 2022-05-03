export const noIndexValues = [true, false, undefined] as const;
export type NoIndex = typeof noIndexValues[number];

interface Seo {
  title?: string;
  description?: string;
  noIndex?: NoIndex;
}

export default Seo;
