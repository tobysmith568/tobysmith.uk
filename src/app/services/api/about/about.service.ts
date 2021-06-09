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
    icon?: {
      url: string;
    };
  }[];
  seo: SEO;
}

interface Response {
  abouts: About[];
}

@Injectable({
  providedIn: "root"
})
export class AboutServiceGQL extends Query<Response> {
  document = gql`
    query About {
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
          icon {
            url
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
