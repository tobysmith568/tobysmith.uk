import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { SEO } from "../seo.interface";

interface Response {
  projectPages: [ProjectPage];
}

interface ProjectPage {
  projects: Project[];
  seo?: SEO;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: {
    html: string;
  };
}

@Injectable({
  providedIn: "root"
})
export class ProjectsServiceGQL extends Query<Response> {
  document = gql`
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
}
