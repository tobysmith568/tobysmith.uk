export interface ICategory {
  slug: string;
  displayName: string;
  description: string;
  children: ICategory[];
}
