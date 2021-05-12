import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Response {
  posts: Post[];
}

@Injectable({
  providedIn: "root"
})
export class PostsServiceGQL extends Query<Response> {
  document = gql`
    query Posts {
      posts(orderBy: date_DESC) {
        slug
        title
        date
        excerpt
      }
    }
  `;
}
