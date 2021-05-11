import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  content: {
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
    {
      projects {
        slug
        title
        subtitle
        content {
          html
        }
      }
    }
  `;
}
