import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { SEO } from "../seo.interface";

export interface About {
  avatar: {
    url: string;
  };
  topText: {
    html: string;
  };
  mainText: {
    html: string;
  };
  tags: {
    name: string;
    url: string;
  }[];
}

interface Response {
  seo: SEO;
  abouts: About[];
}

@Injectable({
  providedIn: "root"
})
export class AboutServiceGQL extends Query<Response> {
  document = gql`
    query About {
      seo(where: { identifier: "about" }) {
        title
        description
      }
      abouts(first: 1) {
        avatar {
          url
        }
        topText {
          html
        }
        mainText {
          html
        }
        tags {
          name
          url
        }
        seo {
          title
          description
        }
      }
    }
  `;
}
