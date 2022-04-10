import styled from "@emotion/styled";
import { FC } from "react";
import { Project } from "../gql/projects";
import CmsContent from "./cms-content";
import HorizontalRule from "./horizontal-rule";

interface Props {
  project: Project;
}

const ProjectResult: FC<Props> = ({ project }) => (
  <article>
    <Project href={"/projects/" + project.slug}>
      <header>
        <h2>{project.title}</h2>
        <h4>{project.subtitle}</h4>
      </header>
      <CmsContent html={project.summary.html} />
    </Project>

    <HorizontalRule />
  </article>
);
export default ProjectResult;

const Project = styled.a`
  text-decoration: none;
  position: relative;
  color: ${({ theme }) => theme.colours.black};

  h2 {
    position: relative;
    color: ${({ theme }) => theme.colours.black};
    margin-bottom: 0;
    width: fit-content;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${({ theme }) => theme.colours.black};
      opacity: 0;
      transition: opacity 300ms, transform 300ms;
    }
  }

  &:hover h2::after,
  &:focus h2::after {
    opacity: 1;
    transform: translate3d(0, 0.15em, 0);
  }

  h4 {
    margin-top: 0.4em;
  }
`;
