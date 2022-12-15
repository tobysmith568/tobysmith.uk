import styled from "@emotion/styled";
import Link from "next/link";
import { FC } from "react";
import { Project } from "../../gql/projects";
import CmsContent from "../cms-content";
import HorizontalRule from "../horizontal-rule";

interface Props {
  project: Project;
}

const ProjectResult: FC<Props> = ({ project }) => (
  <article>
    <Link href={"/projects/" + project.slug} passHref legacyBehavior>
      <Project>
        <header>
          <h2>{project.title}</h2>
          <h4>{project.subtitle}</h4>
        </header>

        <CmsContent type="html" content={project.summary.html} />
      </Project>
    </Link>

    <HorizontalRule />
  </article>
);
export default ProjectResult;

const Project = styled.a`
  ${({ theme }) => theme.underline.hoverTarget("black")};
  font-weight: normal;

  h2 {
    position: relative;
    color: ${({ theme }) => theme.colours.black};
    margin-bottom: 0;
    width: fit-content;

    &::after {
      ${({ theme }) => theme.underline.after("black")};
    }
  }

  &:hover h2::after,
  &:focus h2::after {
    ${({ theme }) => theme.underline.afterOnHover()};
  }

  h4 {
    margin-top: 0.4em;
  }
`;
