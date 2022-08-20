import highlightCode from "../utils/api-only/highlight-code";
import { client, gql } from "./client";
import Seo from "./seo";

export interface Project {
  title: string;
  subtitle: string;
  content: {
    html: string;
  };
  seo?: Seo;
}

interface ProjectResponse {
  project: Project;
}

interface Variables {
  slug: string;
}

const getProject = async (slug: string): Promise<Project> => {
  const query = gql`
    query GetProject($slug: String) {
      project(where: { slug: $slug }) {
        title
        subtitle
        content {
          html
        }
        seo {
          title
          description
          noIndex
        }
      }
    }
  `;

  const variables: Variables = {
    slug
  };

  const { project } = await client.request<ProjectResponse, Variables>(query, variables);

  if (!project) {
    throw new Error(`Could not find a project with the slug ${slug}`);
  }

  project.content.html = highlightCode(project.content.html);

  return project;
};
export default getProject;
