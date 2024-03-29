import highlightCode from "../utils/api-only/highlight-code";
import { client, gql, VariablesBase } from "./client";
import Seo from "./seo";

export interface BlogPost {
  title: string;
  date: string;
  content: {
    html: string;
  };
  seo?: Seo;
}

export interface BlogPostResponse {
  post?: BlogPost;
}

interface Variables extends VariablesBase {
  slug: string;
}

const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const query = gql`
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

  const variables: Variables = {
    slug
  };

  const { post } = await client.request<BlogPostResponse, Variables>(query, variables);

  if (!post) {
    throw new Error(`Could not find a blog post with the slug ${slug}`);
  }

  post.content.html = highlightCode(post.content.html);

  return post;
};
export default getBlogPost;
