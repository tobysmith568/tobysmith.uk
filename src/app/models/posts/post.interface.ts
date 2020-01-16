import { IGithub } from "./sidebar/github.interface";
import { IItch } from "./sidebar/itch.interface";
import { ISkill } from "./sidebar/skill";
import { IDownload } from "./sidebar/download.interface";

export interface IPost {
  title: string;
  contentPath: string;
  date: string;
  author: string;
  slug: string;
  categories: string[];
  preview: string;
  externalLink: string;
  github: IGithub;
  itch: IItch;
  skill: ISkill;
  download: IDownload;
}
