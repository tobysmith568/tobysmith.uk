import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { SEO } from "../seo.interface";

export interface Post {
  title: string;
  date: string;
  content: {
    html: string;
  };
  seo?: SEO;
}

interface Response {
  post?: Post;
}

@Injectable({
  providedIn: "root"
})
export class PostServiceGQL extends Query<Response> {
  document = gql`
    query Post($slug: String) {
      post(where: { slug: $slug }) {
        title
        date
        content {
          html
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
