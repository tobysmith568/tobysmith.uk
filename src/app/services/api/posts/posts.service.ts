import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { SEO } from "../seo.interface";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Response {
  seo?: SEO;
  posts: Post[];
}

@Injectable({
  providedIn: "root"
})
export class PostsServiceGQL extends Query<Response> {
  document = gql`
    query Posts {
      seo(where: { identifier: "posts" }) {
        title
        description
        noIndex
      }
      posts(orderBy: date_DESC) {
        slug
        title
        date
        excerpt
      }
    }
  `;
}
