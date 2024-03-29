import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogResult from "../../components/blog/blog-result";
import Seo from "../../components/seo";
import UnderlineAnchor from "../../components/underline-anchor";
import getBlogPosts, { Blog } from "../../gql/blog";

type Props = Blog;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const blogPage = await getBlogPosts();

  return {
    props: blogPage
  };
};

const BlogPage: NextPage<Props> = ({ posts, seo }) => {
  return (
    <>
      <Seo {...seo} />

      <main>
        <Header>
          <Title>Posts</Title>

          <Link href="/blog/rss" passHref legacyBehavior>
            <UnderlineAnchor target="_blank">
              <RssFeedTitle>RSS Feed</RssFeedTitle>
              <span>
                <Image src="/img/rss.svg" height="21" width="21" alt="" />
              </span>
            </UnderlineAnchor>
          </Link>
        </Header>

        {posts.map(post => (
          <BlogResult key={post.slug} post={post} />
        ))}
      </main>
    </>
  );
};
export default BlogPage;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  a {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  flex-grow: 1;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    margin-top: 0;
  }
`;

const RssFeedTitle = styled.span`
  margin-right: 0.2em;
`;
