import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";

export interface Project {
  title: string;
  subtitle: string;
  content: {
    html: string;
  };
}

interface Response {
  project: Project;
}

interface Variables {
  slug: string;
}

@Injectable({
  providedIn: "root"
})
export class ProjectServiceGQL extends Query<Response, Variables> {
  document = gql`
    query GetProject($slug: String) {
      project(where: { slug: $slug }) {
        title
        subtitle
        content {
          html
        }
      }
    }
  `;
}
