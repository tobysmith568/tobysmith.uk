import { screen, within } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import getProject, { Project } from "../../../src/gql/project";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import ProjectPage, { getServerSideProps } from "../../../src/pages/projects/[slug]";
import isNotFoundResult from "../../test-helpers/is-not-found-result";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");
jest.mock("../../../src/components/cms-content");

jest.mock("../../../src/gql/project", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("[slug]", () => {
  const mockedGetProject = jest.mocked(getProject);

  let title: string;
  let subtitle: string;
  let content: { html: string };
  let seo: Seo;

  beforeEach(() => {
    title = "project title";
    subtitle = "project subtitle";
    content = { html: "<p>project content</p>" };
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });
  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(<ProjectPage title={title} subtitle={subtitle} content={content} seo={seo} />);

  describe("getServerSideProps", () => {
    it("should return notFound if there is no slug", async () => {
      const context = {} as GetServerSidePropsContext<any, any>;

      const result = await getServerSideProps(context);

      expect(isNotFoundResult(result)).toBe(true);
    });

    it("should call getProject with the given slug", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      await getServerSideProps(context);

      expect(mockedGetProject).toHaveBeenCalledTimes(1);
      expect(mockedGetProject).toHaveBeenCalledWith("slug-1");
    });

    it("should return the project returned from getProject", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      const project: Project = {
        title: "title-1"
      } as Project;

      mockedGetProject.mockResolvedValue(project);

      const result = await getServerSideProps(context);

      expect(result).toEqual({ props: project });
    });

    it("should return notFound if getProject throws", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      mockedGetProject.mockRejectedValue(new Error("error"));

      const result = await getServerSideProps(context);

      expect(isNotFoundResult(result)).toBe(true);
    });
  });

  describe("ProjectPage", () => {
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

    it("should contain an article tag", () => {
      render();

      const article = screen.getByRole("article");

      expect(article).toBeInTheDocument();
    });

    it("should contain a header banner within the article", () => {
      render();

      const article = screen.getByRole("article");
      const headerBanner = within(article).getByRole("banner");

      expect(headerBanner).toBeInTheDocument();
    });

    it("should show the project title in a header within the header banner", () => {
      render();

      const article = screen.getByRole("article");
      const headerBanner = within(article).getByRole("banner");
      const h1Header = within(headerBanner).getByRole("heading", {
        level: 1
      });

      expect(h1Header).toHaveTextContent(title);
    });

    it("should show the project subtitle in a header within the header banner", () => {
      render();

      const article = screen.getByRole("article");
      const headerBanner = within(article).getByRole("banner");
      const h3Header = within(headerBanner).getByRole("heading", {
        level: 3
      });

      expect(h3Header).toHaveTextContent(subtitle);
    });

    it("should render the content as CMS content within the article", () => {
      render();

      const article = screen.getByRole("article");
      const cmsContent = within(article).getByTestId("cms-content-content");

      expect(cmsContent).toHaveTextContent(content.html);
    });

    it("should render the content as HTML within the article", () => {
      render();

      const article = screen.getByRole("article");
      const cmsContentType = within(article).getByTestId("cms-content-type");

      expect(cmsContentType).toHaveTextContent("html");
    });
  });
});
