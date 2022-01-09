import { Inject, Injectable } from "@angular/core";
import { Apollo, gql, Query } from "apollo-angular";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";
import { SEO } from "../seo.interface";

interface Response {
  postPages: PostPage[];
  posts: Post[];
}

interface PostPage {
  seo?: SEO;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

@Injectable({
  providedIn: "root"
})
export class PostsServiceGQL extends Query<Response> {
  constructor(apollo: Apollo, @Inject(ENVIRONMENT) public readonly environment: IEnvironment) {
    super(apollo);
  }

  document = gql`
    query Posts {
      posts(orderBy: date_DESC ${this.allowDevOnly()}) {
        slug
        title
        date
        excerpt
      }
      postPages(first: 1) {
        seo {
          title
          description
          noIndex
        }
      }
    }
  `;

  private allowDevOnly(): string {
    if (this.environment.production) {
      return ", where: {OR: [{devOnly: null}, {devOnly: false}]}";
    }

    return "";
  }
}
