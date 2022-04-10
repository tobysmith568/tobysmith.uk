import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import Category from "../../components/all-projects/category";
import BackButton from "../../components/back-button";
import Seo from "../../components/seo";
import getAllProjectsPage, { AllProjectsPage } from "../../gql/all-projects";

type Props = AllProjectsPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const projectsPage = await getAllProjectsPage();

  return {
    props: projectsPage
  };
};

const AllProjectsPage: NextPage<Props> = ({ categories, seo }) => {
  return (
    <>
      <Seo {...seo} />

      <main>
        <BackButton />

        <h1>All Projects</h1>
        <Subtitle>A list of all my projects; no matter how big, small, or incomplete!</Subtitle>

        {categories.map(category => (
          <Category key={category.name} category={category} />
        ))}
      </main>
    </>
  );
};
export default AllProjectsPage;

const Subtitle = styled.p``;
