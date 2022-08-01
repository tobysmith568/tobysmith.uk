import { screen } from "@testing-library/dom";
import getAllProjects, { Category } from "../../../src/gql/all-projects";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import AllProjectsPage, { getServerSideProps } from "../../../src/pages/projects/all";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");

jest.mock("../../../src/components/all-projects/category", () => ({
  __esModule: true,
  default: (props: { category: Category }) => (
    <div data-testid="category">{props.category.name}</div>
  )
}));

jest.mock("../../../src/gql/all-projects", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("all", () => {
  const mockedGetAllProjects = jest.mocked(getAllProjects);

  let categories: Category[];
  let seo: Seo;

  beforeEach(() => {
    categories = [{ name: "Category 1" }, { name: "Category 2" }] as Category[];
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<AllProjectsPage categories={categories} seo={seo} />);

  describe("getServerSideProps", () => {
    it("should return the projectPage returned from getAllProjectsPage", async () => {
      mockedGetAllProjects.mockResolvedValue({ categories, seo });

      const result = await getServerSideProps(undefined!);

      expect(result).toEqual({ props: { categories, seo } });
    });
  });

  describe("AllProjectsPage", () => {
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

    it("should have the correct title", () => {
      render();

      const title = screen.getByRole("heading", { level: 1 });

      expect(title).toHaveTextContent("Projects");
    });

    it("should have the correct subtitle", () => {
      render();

      const subtitle = screen.getByText(
        /a list of all my projects; no matter how big, small, or incomplete!/i
      );

      expect(subtitle).toBeInTheDocument();
    });

    it("should render all of the categories", () => {
      render();

      const categoryNodes = screen.getAllByTestId("category");

      expect(categoryNodes).toHaveLength(2);
      categoryNodes.forEach((c, i) => expect(c).toHaveTextContent(categories[i].name));
    });
  });
});
