import { client, gql, VariablesBase } from "./client";
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

export interface BlogResponse {
  postPages: PostPage[];
  posts: Post[];
}

export interface Blog {
  seo?: Seo;
  posts: Post[];
}

interface Variables extends VariablesBase {
  term: string;
}

const getBlogSearchPosts = async (term: string): Promise<Blog> => {
  const query = gql`
    query Search($term: String) {
      posts(
        orderBy: date_DESC
        where: { AND: [{ _search: $term }, { OR: [{ devOnly: null }, { devOnly: false }] }] }
      ) {
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

  const variables: Variables = {
    term
  };

  const { postPages, posts } = await client.request<BlogResponse, Variables>(query, variables);

  if (postPages.length !== 1) {
    throw new Error(`Expected exactly one postPage but got ${postPages.length}`);
  }

  return { seo: postPages[0].seo, posts };
};
export default getBlogSearchPosts;
