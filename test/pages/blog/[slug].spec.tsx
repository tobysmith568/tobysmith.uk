import { screen, within } from "@testing-library/dom";
import { DiscussionEmbed } from "disqus-react";
import { GetServerSidePropsContext } from "next";
import getBlogPost, { BlogPost } from "../../../src/gql/blog-post";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import BlogPostPage, { getServerSideProps } from "../../../src/pages/blog/[slug]";
import { defaultMockEnv } from "../../../src/utils/api-only/__mocks__/env";
import isNotFoundResult from "../../test-helpers/is-not-found-result";
import isRedirectResult from "../../test-helpers/is-redirect-result";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");
jest.mock("../../../src/components/cms-content");
jest.mock("../../../src/utils/api-only/env");
jest.mock("disqus-react", () => ({
  __esModule: true,
  DiscussionEmbed: jest.fn()
}));

jest.mock("../../../src/gql/blog-post", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("[slug]", () => {
  const mockedGetBlogPost = jest.mocked(getBlogPost);
  const mockedDiscussionEmbed = jest.mocked(DiscussionEmbed);

  let title: string;
  let date: string;
  let content: { html: string };
  let seo: Seo;

  let slug: string;
  let disqusShortname: string;
  let disqusBlogUrl: string;

  beforeEach(() => {
    title = "post title";
    date = "08 May 2022";
    content = { html: "<p>post content</p>" };
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    slug = "post-slug";
    disqusShortname = "disqus-shortname";
    disqusBlogUrl = "disqus-blog-url";

    jest.resetAllMocks();

    mockedDiscussionEmbed.mockImplementation(
      () =>
        (<div data-testid="discussion-embed">DiscussionEmbed</div>) as unknown as DiscussionEmbed
    );
  });
  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(
      <BlogPostPage
        title={title}
        date={date}
        content={content}
        seo={seo}
        slug={slug}
        disqusShortname={disqusShortname}
        disqusBlogUrl={disqusBlogUrl}
      />
    );

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

    it("should return the information for the blog post returned from getBlogPost", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      const blogPost: BlogPost = {
        title: "title-1"
      } as BlogPost;

      mockedGetBlogPost.mockResolvedValue(blogPost);

      const result = await getServerSideProps(context);

      expect(result).toEqual({ props: expect.objectContaining(blogPost) });
    });

    it("should return notFound if getBlogPost throws", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      mockedGetBlogPost.mockRejectedValue(new Error("error"));

      const result = await getServerSideProps(context);

      expect(isNotFoundResult(result)).toBe(true);
    });

    it("should return the post slug", async () => {
      const slug = "slug-1";
      const context = { params: { slug } } as GetServerSidePropsContext<any, any>;

      mockedGetBlogPost.mockResolvedValue({} as BlogPost);

      const result = await getServerSideProps(context);

      if (isNotFoundResult(result) || isRedirectResult(result)) {
        fail("Result should not be a not found or redirect result");
      }

      expect(result.props).toStrictEqual(expect.objectContaining({ slug }));
    });

    it("should return the disqus shortname from getEnv", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      mockedGetBlogPost.mockResolvedValue({} as BlogPost);

      const result = await getServerSideProps(context);

      if (isNotFoundResult(result) || isRedirectResult(result)) {
        fail("Result should not be a not found or redirect result");
      }

      expect(result.props).toStrictEqual(
        expect.objectContaining({
          disqusShortname: defaultMockEnv.disqus.shortName
        })
      );
    });

    it("should return the disqus blog url from getEnv", async () => {
      const context = { params: { slug: "slug-1" } } as GetServerSidePropsContext<any, any>;

      mockedGetBlogPost.mockResolvedValue({} as BlogPost);

      const result = await getServerSideProps(context);

      if (isNotFoundResult(result) || isRedirectResult(result)) {
        fail("Result should not be a not found or redirect result");
      }

      expect(result.props).toStrictEqual(
        expect.objectContaining({
          disqusBlogUrl: defaultMockEnv.disqus.blogUrl
        })
      );
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

    describe("disqus", () => {
      it("should render the disqus comment section", () => {
        render();

        const disqus = screen.getByTestId("discussion-embed");

        expect(disqus).toBeInTheDocument();
      });

      it("should pass the disqus shortname to the disqus element", () => {
        render();

        expect(mockedDiscussionEmbed).toHaveBeenCalledWith(
          expect.objectContaining({
            shortname: disqusShortname
          }),
          expect.anything()
        );
      });

      it("should pass the post slug as the disqus identifier to the disqus element", () => {
        render();

        expect(mockedDiscussionEmbed).toHaveBeenCalledWith(
          {
            shortname: expect.any(String),
            config: expect.objectContaining({
              identifier: slug
            })
          },
          expect.anything()
        );
      });

      it("should pass the disqus blog url with the slug as the disqus url to the disqus element", () => {
        const expectedUrl = `${disqusBlogUrl}/${slug}`;

        render();

        expect(mockedDiscussionEmbed).toHaveBeenCalledWith(
          {
            shortname: expect.any(String),
            config: expect.objectContaining({
              url: expectedUrl
            })
          },
          expect.anything()
        );
      });
    });
  });
});
