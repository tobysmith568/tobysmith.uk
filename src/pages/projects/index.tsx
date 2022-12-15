import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import ProjectResult from "../../components/projects/project-result";
import Seo from "../../components/seo";
import UnderlineAnchor from "../../components/underline-anchor";
import getProjectsPage, { ProjectsPage } from "../../gql/projects";

type Props = ProjectsPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const projectsPage = await getProjectsPage();

  return {
    props: projectsPage
  };
};

const ProjectsPage: NextPage<Props> = ({ projects, seo }) => {
  return <>
    <Seo {...seo} />

    <main>
      <Header>
        <Title>Projects</Title>

        <Link href="/projects/all" passHref legacyBehavior>
          <UnderlineAnchor>
            <span>All Projects</span>
          </UnderlineAnchor>
        </Link>
      </Header>
      <Subtitle>A selection of my best work to date, demonstrating some of my abilities</Subtitle>

      {projects.map(project => (
        <ProjectResult key={project.slug} project={project} />
      ))}
    </main>
  </>;
};
export default ProjectsPage;

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
    margin-bottom: 0.5em;
  }
`;

const Subtitle = styled.p`
  margin-top: 0;
`;
