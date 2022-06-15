import styled from "@emotion/styled";
import { DiscussionEmbed } from "disqus-react";
import { GetServerSideProps, NextPage } from "next";
import BackButton from "../../components/back-button";
import CmsContent from "../../components/cms-content";
import FormattedDate from "../../components/formatted-date";
import Seo from "../../components/seo";
import getBlogPost, { BlogPost } from "../../gql/blog-post";
import { getEnv } from "../../utils/api-only/env";

interface Props extends BlogPost {
  slug: string;
  disqusShortname: string;
  disqusBlogUrl: string;
}

type Params = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const { disqus } = getEnv();
  const { shortName, blogUrl } = disqus;

  try {
    const blogPost = await getBlogPost(params.slug);
    return {
      props: {
        slug: params.slug,
        disqusShortname: shortName,
        disqusBlogUrl: blogUrl,
        ...blogPost
      }
    };
  } catch {
    return { notFound: true };
  }
};

const BlogPostPage: NextPage<Props> = props => {
  const { slug, title, date, content, seo, disqusShortname, disqusBlogUrl } = props;
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

          <CmsWrapper>
            <CmsContent type="html" content={content.html} />
          </CmsWrapper>

          <DiscussionEmbed
            shortname={disqusShortname}
            config={{
              url: disqusBlogUrl + "/" + slug,
              identifier: slug
            }}
          />
        </article>
      </main>
    </>
  );
};
export default BlogPostPage;

const Title = styled.h1`
  font-size: 2em;
`;

const CmsWrapper = styled.div`
  margin-bottom: 3em;
`;
