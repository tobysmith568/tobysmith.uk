import { client, gql } from "./client";
import Seo from "./seo";

// cSpell:words abouts

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
  seo: Seo;
}

interface GetAboutResponse {
  abouts: About[];
}

const getAbout = async (): Promise<About> => {
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

  const { abouts } = await client.request<GetAboutResponse>(query);

  if (abouts.length !== 1) {
    throw new Error(`Expected exactly one about but got ${abouts.length}`);
  }

  return abouts[0];
};
export default getAbout;
