import { Inject, Injectable } from "@angular/core";
import { Apollo, gql, Query } from "apollo-angular";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";
import { SEO } from "../seo.interface";

interface Response {
  projectIndexPages: ProjectIndexPage[];
}

export interface ProjectIndexPage {
  categories: Category[];
  seo?: SEO;
}

interface Category {
  name: string;
  items: Item[];
}

interface Item {
  title: string;
  content: {
    html: string;
  };
  url?: string;
  abandoned?: boolean;
  incomplete?: boolean;
  owner: Owner;
}

type Owner = "Owner" | "JointOwner" | "Contributor";

@Injectable({
  providedIn: "root"
})
export class ProjectIndexService extends Query<Response> {
  constructor(apollo: Apollo, @Inject(ENVIRONMENT) public readonly environment: IEnvironment) {
    super(apollo);
  }

  document = gql`
    query AllProjects {
      projectIndexPages(first: 1) {
        categories {
          name
          items {
            title
            content {
              html
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
}
