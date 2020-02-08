import { ILanguage } from "./language.interface";

export interface IRepository {
  name: string;
  languages: ILanguage[];
  description: string;
  url: string;
  updatedAt: string;
  stargazers: number;
}
