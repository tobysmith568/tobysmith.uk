import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import BackButton from "../../components/back-button";
import CmsContent from "../../components/cms-content";
import FormattedDate from "../../components/formatted-date";
import Seo from "../../components/seo";
import getBlogPost, { BlogPost } from "../../gql/blog-post";

type Props = BlogPost;

type Params = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  try {
    const blogPost = await getBlogPost(params.slug);
    return { props: blogPost };
  } catch {
    return { notFound: true };
  }
};

const BlogPostPage: NextPage<Props> = ({ title, date, content, seo }) => {
  return (
    <>
      <Seo {...seo} />

      <main>
        <BackButton />

        <article>
          <header>
            <Title>{title}</Title>
            <h3>
              <FormattedDate dateValue={date} />
            </h3>
          </header>

          <CmsContent type="html" content={content.html} />
        </article>
      </main>
    </>
  );
};
export default BlogPostPage;

const Title = styled.h1`
  font-size: 2em;
`;
