import { screen } from "@testing-library/react";
import ProjectResult from "../../../src/components/projects/project-result";
import { Project } from "../../../src/gql/projects";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/formatted-date", () => ({
  __esModule: true,
  default: (props: any) => <>{props.dateValue}</>
}));

describe("project-result", () => {
  let project: Project;

  beforeEach(() => {
    project = {
      title: "Test title",
      subtitle: "Test subtitle",
      slug: "test-title",
      summary: {
        html: "Test summary"
      }
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<ProjectResult project={project} />);

  describe("link", () => {
    it("should link to the project slug", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveAttribute("href", `/projects/${project.slug}`);
    });

    it("should include the project title in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(project.title));
    });

    it("should include the project subtitle in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(project.subtitle));
    });

    it("should include the project summary in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(project.summary.html));
    });
  });
});
