import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import BlogResult from "../../../components/blog/blog-result";
import useSearchTerm from "../../../components/header/useSearchTerm";
import Seo from "../../../components/seo";
import getBlogSearchPosts, { Blog } from "../../../gql/blog-search";
import SeoType from "../../../gql/seo";

export type Props = Blog & { searchTerm: string };

export type Params = {
  searchTerm: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }) => {
  const term = params?.searchTerm;

  if (!term) {
    return { redirect: { destination: "/blog" }, props: null! };
  }

  const blog = await getBlogSearchPosts(term);

  const seo: SeoType = {
    ...blog.seo,
    noIndex: true
  };

  return {
    props: {
      posts: blog.posts,
      seo,
      searchTerm: term
    }
  };
};

const SearchResultsPage: NextPage<Props> = ({ posts, seo, searchTerm }) => {
  const [, setSearchTerm] = useSearchTerm();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSearchTerm(searchTerm), []);

  return (
    <>
      <Seo {...seo} />

      <main>
        <Header>
          <h1>Search results for &quot;{searchTerm}&quot;</h1>
        </Header>

        {posts.map(post => (
          <BlogResult key={post.slug} post={post} />
        ))}
      </main>
    </>
  );
};
export default SearchResultsPage;

const Header = styled.div`
  display: flex;
`;
