import { IGithub } from "./sidebar/github.interface";
import { IItch } from "./sidebar/itch.interface";
import { ISkill } from "./sidebar/skill";
import { IDownload } from "./sidebar/download.interface";
import { IInternalLink } from "./internalLink.interface";

export interface IPost {
  title: string;
  contentPath: string;
  date: Date;
  author: string;
  slug: string;
  categories: string[];
  preview: string;
  previewImage: string;
  externalLink: string;
  internalLink: IInternalLink;
  github: IGithub;
  itch: IItch;
  skill: ISkill;
  downloads: IDownload[];
}
