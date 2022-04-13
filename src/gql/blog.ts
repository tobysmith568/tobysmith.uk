import { getEnv } from "../env";
import { client, gql } from "./client";
import Seo from "./seo";

interface PostPage {
  seo?: Seo;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface BlogResponse {
  postPages: PostPage[];
  posts: Post[];
}

export interface Blog {
  seo?: Seo;
  posts: Post[];
}

const getBlogPosts = async (): Promise<Blog> => {
  const query = gql`
    query Blog {
      posts(orderBy: date_DESC ${allowDevOnly()}) {
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

  const { postPages, posts } = await client.request<BlogResponse>(query);

  if (postPages.length !== 1) {
    throw new Error(`Expected exactly one postPage but got ${postPages.length}`);
  }

  return { seo: postPages[0].seo, posts };
};
export default getBlogPosts;

const allowDevOnly = (): string => {
  if (getEnv().isDevelopment) {
    return ", where: {OR: [{devOnly: null}, {devOnly: false}]}";
  }

  return "";
};
