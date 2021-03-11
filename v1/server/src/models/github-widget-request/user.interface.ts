import { IOrganization } from "./organization.interface";

export interface IUser {
  login: string;
  avatarUrl: string;
  name: string;
  bio: string;
  repoCount: number;
  gistCount: number;
  contributionCount: number;
  organizations: IOrganization[];
  url: string;
}
