import { client, gql } from "./client";
import Seo from "./seo";

export interface ProjectsPage {
  projects: Project[];
  seo?: Seo;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: {
    html: string;
  };
}

interface GetProjectsResponse {
  projectPages: [ProjectsPage];
}

const getProjectsPage = async (): Promise<ProjectsPage> => {
  const query = gql`
    query ProjectPage {
      projectPages(first: 1) {
        projects {
          slug
          title
          subtitle
          summary {
            html
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

  const { projectPages } = await client.request<GetProjectsResponse>(query);

  if (projectPages.length !== 1) {
    throw new Error(`Expected exactly one project page but got ${projectPages.length}`);
  }

  return projectPages[0];
};
export default getProjectsPage;
