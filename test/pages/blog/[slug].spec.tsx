import { screen, within } from "@testing-library/dom";
import { GetServerSidePropsContext } from "next";
import getBlogPost, { BlogPost } from "../../../src/gql/blog-post";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import BlogPostPage, { getServerSideProps } from "../../../src/pages/blog/[slug]";
import isNotFoundResult from "../../test-helpers/is-not-found-result";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");
jest.mock("../../../src/components/cms-content");

jest.mock("../../../src/gql/blog-post", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("[slug]", () => {
  const mockedGetBlogPost = jest.mocked(getBlogPost);

  let title: string;
  let date: string;
  let content: { html: string };
  let seo: Seo;

  beforeEach(() => {
    title = "post title";
    date = "08 May 2022";
    content = { html: "<p>post content</p>" };
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });
  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(<BlogPostPage title={title} date={date} content={content} seo={seo} />);

  describe("getServerSideProps", () => {
    it("should return notFound if there is no slug", async () => {
      const context = {} as GetServerSidePropsContext<any, any>;

      const result = await getServerSideProps(context);

      expect(isNotFoundResult(result)).toBe(true);
    });

    it("should call getBlogPost with the given slug", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      await getServerSideProps(context);

      expect(mockedGetBlogPost).toHaveBeenCalledTimes(1);
      expect(mockedGetBlogPost).toHaveBeenCalledWith("slug-1");
    });

    it("should return the blog post returned from getBlogPost", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      const blogPost: BlogPost = {
        title: "title-1"
      } as BlogPost;

      mockedGetBlogPost.mockResolvedValue(blogPost);

      const result = await getServerSideProps(context);

      expect(result).toEqual({ props: blogPost });
    });

    it("should return notFound if getBlogPost throws", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      mockedGetBlogPost.mockRejectedValue(new Error("error"));

      const result = await getServerSideProps(context);

      expect(isNotFoundResult(result)).toBe(true);
    });
  });

  describe("BlogPostPage", () => {
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

    it("should show the post title in a header within the header banner", () => {
      render();

      const article = screen.getByRole("article");
      const headerBanner = within(article).getByRole("banner");
      const h1Header = within(headerBanner).getByRole("heading", {
        level: 1
      });

      expect(h1Header).toHaveTextContent(title);
    });

    it("should show the post date in a header within the header banner", () => {
      render();

      const article = screen.getByRole("article");
      const headerBanner = within(article).getByRole("banner");
      const h3Header = within(headerBanner).getByRole("heading", {
        level: 3
      });

      expect(h3Header).toHaveTextContent(date);
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
