import { client, gql } from "./client";
import Seo from "./seo";

// cSpell:words abouts

export interface AboutPage {
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
  seo: Seo;
}

interface GetAboutResponse {
  abouts: AboutPage[];
}

const getAboutPage = async (): Promise<AboutPage> => {
  const query = gql`
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

  const { abouts: aboutPages } = await client.request<GetAboutResponse>(query);

  if (aboutPages.length !== 1) {
    throw new Error(`Expected exactly one about page but got ${aboutPages.length}`);
  }

  return aboutPages[0];
};
export default getAboutPage;
