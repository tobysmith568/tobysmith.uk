import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: {
    html: string;
  };
}

interface Response {
  projects: Project[];
}

@Injectable({
  providedIn: "root"
})
export class ProjectsServiceGQL extends Query<Response> {
  document = gql`
    query GetProjects {
      projects {
        slug
        title
        subtitle
        summary {
          html
        }
      }
    }
  `;
}
