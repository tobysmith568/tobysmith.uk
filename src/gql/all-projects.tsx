import { client, gql } from "./client";
import Seo from "./seo";

export interface AllProjectsPage {
  categories: Category[];
  seo?: Seo;
}

export interface Category {
  name: string;
  items: Item[];
}

export interface Item {
  title: string;
  content: {
    text: string;
  };
  url?: string;
  abandoned?: boolean;
  incomplete?: boolean;
  owner: Owner;
}

type Owner = "Owner" | "JointOwner" | "Contributor";

interface AllProjectsResponse {
  projectIndexPages: AllProjectsPage[];
}

const getAllProjectsPage = async (): Promise<AllProjectsPage> => {
  const query = gql`
    query AllProjects {
      projectIndexPages(first: 1) {
        categories {
          name
          items {
            title
            content {
              text
            }
            url
            abandoned
            incomplete
            owner
          }
        }
        seo {
          title
          description
          noIndex
        }
      }
    }
  `;

  const { projectIndexPages } = await client.request<AllProjectsResponse>(query);

  if (projectIndexPages.length !== 1) {
    throw new Error(`Expected exactly one project page but got ${projectIndexPages.length}`);
  }

  return projectIndexPages[0];
};
export default getAllProjectsPage;
