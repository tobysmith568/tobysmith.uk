import { Inject, Injectable } from "@angular/core";
import { Apollo, gql, Query } from "apollo-angular";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";
import { Post } from "../posts/posts.service";

interface Response {
  posts: Post[];
}

interface Variables {
  term: string;
}

@Injectable({
  providedIn: "root"
})
export class SearchServiceGQL extends Query<Response, Variables> {
  constructor(apollo: Apollo, @Inject(ENVIRONMENT) public readonly environment: IEnvironment) {
    super(apollo);
  }

  document = gql`
    query Search($term: String) {
      posts(where: { AND: [{_search: $term}${this.allowDevOnly()}] }) {
        slug
        title
        date
        excerpt
      }
    }
  `;

  private allowDevOnly(): string {
    if (this.environment.production) {
      return ", { OR: [{devOnly: null}, {devOnly: false}] } ";
    }

    return "";
  }
}
