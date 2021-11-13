import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { SEO } from "../seo.interface";

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
  seo: SEO;
}

@Injectable({
  providedIn: "root"
})
export class ProjectsServiceGQL extends Query<Response> {
  document = gql`
    query GetProjects {
      seo(where: { identifier: "projects" }) {
        title
        description
        noIndex
      }
      projects(orderBy: order_DESC) {
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
