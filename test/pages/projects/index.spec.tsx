import { screen } from "@testing-library/dom";
import getProjects, { Project } from "../../../src/gql/projects";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import ProjectsPage, { getServerSideProps } from "../../../src/pages/projects";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");

jest.mock("../../../src/gql/projects", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../src/components/projects/project-result", () => ({
  __esModule: true,
  default: (props: { project: { slug: string } }) => (
    <div data-testid="project-result">{props.project.slug}</div>
  )
}));

describe("projects", () => {
  const mockedGetProjects = jest.mocked(getProjects);

  let projects: Project[];
  let seo: Seo;

  beforeEach(() => {
    projects = [{ slug: "project-1" }, { slug: "project-2" }] as Project[];
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<ProjectsPage projects={projects} seo={seo} />);

  describe("getServerSideProps", () => {
    it("should return the projects page", async () => {
      mockedGetProjects.mockResolvedValue({ projects: projects, seo });

      const result = await getServerSideProps(undefined!);

      expect(mockedGetProjects).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ props: { projects: projects, seo } });
    });
  });

  describe("Blog Page", () => {
    describe("seo", () => {
      it("should pass the seo title to the seo element", () => {
        render();

        const seoTitle = screen.getByTestId("seo-title");

        expect(seoTitle).toHaveTextContent(seo.title!);
      });

      it("should pass the seo description to the seo element", () => {
        render();

        const seoDescription = screen.getByTestId("seo-description");

        expect(seoDescription).toHaveTextContent(seo.description!);
      });

      noIndexValues.forEach(noIndex =>
        it(`should pass the seo noIndex value '${noIndex}' to the seo element`, () => {
          seo.noIndex = noIndex;

          render();

          const seoNoIndex = screen.getByTestId("seo-noindex");

          expect(seoNoIndex).toHaveTextContent("" + noIndex);
        })
      );
    });

    describe("Title", () => {
      it("should have the title 'Projects'", () => {
        render();

        const title = screen.getByRole("heading", { name: "Projects" });

        expect(title).toBeInTheDocument();
      });
    });

    describe("All Projects link", () => {
      it("should have the all projects href", () => {
        render();

        const allProjectsLink = screen.getByRole("link", { name: /all projects/i });

        expect(allProjectsLink).toHaveAttribute("href", "/projects/all");
      });

      it("should not open in a new tab", () => {
        render();

        const allProjectsLink = screen.getByRole("link", { name: /all projects/i });

        expect(allProjectsLink).not.toHaveAttribute("target");
      });
    });

    describe("Projects results", () => {
      it("should render all of the projects projects", () => {
        render();

        const projectsResults = screen.getAllByTestId("project-result");

        expect(projectsResults).toHaveLength(projects.length);
        projects.forEach((p, i) => expect(projectsResults[i]).toHaveTextContent(p.slug));
      });
    });
  });
});
