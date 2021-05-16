import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
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
  document = gql`
    query Search($term: String) {
      posts(where: { _search: $term }) {
        slug
        title
        date
        excerpt
      }
    }
  `;
}
