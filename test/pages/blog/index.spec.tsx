import { screen, within } from "@testing-library/react";
import getBlogPosts, { Post } from "../../../src/gql/blog";
import Seo, { noIndexValues } from "../../../src/gql/seo";
import BlogPage, { getServerSideProps } from "../../../src/pages/blog";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/seo");

jest.mock("../../../src/gql/blog", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../src/components/blog/blog-result", () => ({
  __esModule: true,
  default: (props: { post: { slug: string } }) => (
    <div data-testid="blog-result">{props.post.slug}</div>
  )
}));

describe("blog", () => {
  const mockedGetBlogPosts = jest.mocked(getBlogPosts);

  let posts: Post[];
  let seo: Seo;

  beforeEach(() => {
    posts = [{ slug: "post-1" }, { slug: "post-2" }] as Post[];
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<BlogPage posts={posts} seo={seo} />);

  describe("getServerSideProps", () => {
    it("should return the blog page", async () => {
      mockedGetBlogPosts.mockResolvedValue({ posts, seo });

      const result = await getServerSideProps(undefined!);

      expect(mockedGetBlogPosts).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ props: { posts, seo } });
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
      it("should have the title 'Posts'", () => {
        render();

        const title = screen.getByRole("heading", { name: "Posts" });

        expect(title).toBeInTheDocument();
      });
    });

    describe("RSS feed link", () => {
      it("should have the RSS feed href", () => {
        render();

        const rssFeedLink = screen.getByRole("link", { name: /rss feed/i });

        expect(rssFeedLink).toHaveAttribute("href", "/blog/rss");
      });

      it("should open in a new tab", () => {
        render();

        const rssFeedLink = screen.getByRole("link", { name: /rss feed/i });

        expect(rssFeedLink).toHaveAttribute("target", "_blank");
      });

      it("should contain the RSS logo", () => {
        render();

        const rssFeedLink = screen.getByRole("link", { name: /rss feed/i });
        const rssFeedLogo = within(rssFeedLink).getByRole("img");

        expect(rssFeedLogo).toBeInTheDocument();
      });
    });

    describe("Blog results", () => {
      it("should render all of the blog posts", () => {
        render();

        const blogResults = screen.getAllByTestId("blog-result");

        expect(blogResults).toHaveLength(posts.length);
        posts.forEach((p, i) => expect(blogResults[i]).toHaveTextContent(p.slug));
      });
    });
  });
});
