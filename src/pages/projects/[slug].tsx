import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import BackButton from "../../components/back-button";
import CmsContent from "../../components/cms-content";
import Seo from "../../components/seo";
import getProject, { Project } from "../../gql/project";

type Props = Project;

type Params = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  try {
    const project = await getProject(params.slug);
    return { props: project };
  } catch {
    return { notFound: true };
  }
};

const ProjectPage: NextPage<Props> = ({ title, subtitle, content, seo }) => {
  return (
    <>
      <Seo {...seo} />

      <main>
        <BackButton />

        <article>
          <header>
            <Title>{title}</Title>
            <h3>{subtitle}</h3>
          </header>

          <CmsContent type="html" content={content.html} />
        </article>
      </main>
    </>
  );
};
export default ProjectPage;

const Title = styled.h1`
  font-size: 2em;
`;
