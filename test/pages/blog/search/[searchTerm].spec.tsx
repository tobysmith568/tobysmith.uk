import { screen } from "@testing-library/dom";
import { GetServerSidePropsContext } from "next";
import useSearchTerm from "../../../../src/components/header/useSearchTerm";
import getBlogSearchPosts, { Blog, Post } from "../../../../src/gql/blog-search";
import { noIndexValues } from "../../../../src/gql/seo";
import SearchResultsPage, {
  getServerSideProps,
  Params,
  Props
} from "../../../../src/pages/blog/search/[searchTerm]";
import renderWithTheme from "../../../test-helpers/render-with-theme";

jest.mock("../../../../src/components/seo");

jest.mock("../../../../src/gql/blog-search", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../../src/components/blog/blog-result", () => ({
  __esModule: true,
  default: (props: { post: { slug: string } }) => (
    <div data-testid="blog-result">{props.post.slug}</div>
  )
}));

jest.mock("../../../../src/components/header/useSearchTerm", () => ({
  __esModule: true,
  default: () => [undefined, jest.fn()]
}));

describe("[searchTerm]", () => {
  const mockedGetBlogSearchPosts = jest.mocked(getBlogSearchPosts);
  const mockedSetUseSearchTerm = jest.mocked(useSearchTerm);

  const props: Props = {
    posts: [{ slug: "slug#1" }, { slug: "slug#2" }] as Post[],
    seo: {
      title: "SEO Title",
      description: "SEO Description"
    },
    searchTerm: "search term"
  };

  beforeEach(jest.resetModules);
  afterEach(jest.restoreAllMocks);

  const render = () => renderWithTheme(<SearchResultsPage {...props} />);

  describe("getServerSideProps", () => {
    it("should return a redirect to the blog if there's no params", async () => {
      const context: GetServerSidePropsContext<Params> = {} as GetServerSidePropsContext<Params>;

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("redirect.destination", "/blog");
    });

    it("should return null props if there's no params", async () => {
      const context: GetServerSidePropsContext<Params> = {} as GetServerSidePropsContext<Params>;

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("props", null);
    });

    it("should return a redirect to the blog if there's no search term param", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {}
      } as GetServerSidePropsContext<Params>;

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("redirect.destination", "/blog");
    });

    it("should return null props if there's no search term param", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {}
      } as GetServerSidePropsContext<Params>;

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("props", null);
    });

    it("should call getBlogSearchPosts with the search term", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {
          searchTerm: "term"
        }
      } as GetServerSidePropsContext<Params>;

      const blog: Blog = {
        posts: [{ slug: "post#1" }, { slug: "post#2" }] as Post[]
      };

      mockedGetBlogSearchPosts.mockResolvedValue(blog);

      await getServerSideProps(context);

      expect(mockedGetBlogSearchPosts).toHaveBeenCalledTimes(1);
      expect(mockedGetBlogSearchPosts).toHaveBeenCalledWith(context.params?.searchTerm);
    });

    it("should return the blog posts from getBlogSearchPosts", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {
          searchTerm: "term"
        }
      } as GetServerSidePropsContext<Params>;

      const blog: Blog = {
        posts: [{ slug: "post#1" }, { slug: "post#2" }] as Post[]
      };

      mockedGetBlogSearchPosts.mockResolvedValue(blog);

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("props.posts", blog.posts);
    });

    it("should return the seo from getBlogSearchPosts except with noIndex set to true", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {
          searchTerm: "term"
        }
      } as GetServerSidePropsContext<Params>;

      const blog: Blog = {
        posts: [],
        seo: {
          title: "The title",
          description: "The description",
          noIndex: false
        }
      };

      mockedGetBlogSearchPosts.mockResolvedValue(blog);

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("props.seo", {
        ...blog.seo,
        noIndex: true
      });
    });

    it("should return the search term", async () => {
      const context: GetServerSidePropsContext<Params> = {
        params: {
          searchTerm: "term"
        }
      } as GetServerSidePropsContext<Params>;

      const blog: Blog = {
        posts: [],
        seo: {
          title: "The title",
          description: "The description",
          noIndex: false
        }
      };

      mockedGetBlogSearchPosts.mockResolvedValue(blog);

      const result = await getServerSideProps(context);

      expect(result).toHaveProperty("props.searchTerm", context.params?.searchTerm);
    });
  });

  describe("SearchResultsPage", () => {
    describe("seo", () => {
      it("should pass the seo title to the seo element", () => {
        render();

        const seoTitle = screen.getByTestId("seo-title");

        expect(seoTitle).toHaveTextContent(props.seo?.title!);
      });

      it("should pass the seo description to the seo element", () => {
        render();

        const seoDescription = screen.getByTestId("seo-description");

        expect(seoDescription).toHaveTextContent(props.seo?.description!);
      });

      noIndexValues.forEach(noIndex =>
        it(`should pass the seo noIndex value '${noIndex}' to the seo element`, () => {
          props.seo!.noIndex = noIndex;

          render();

          const seoNoIndex = screen.getByTestId("seo-noindex");

          expect(seoNoIndex).toHaveTextContent("" + noIndex);
        })
      );
    });

    it("should show a title containing the search term", async () => {
      render();

      const title = screen.getByRole("heading", { name: /Search results for/ });

      expect(title).toHaveTextContent(`Search results for "${props.searchTerm}"`);
    });

    it("should render all of the blog posts", () => {
      render();

      const blogResults = screen.getAllByTestId("blog-result");

      expect(blogResults).toHaveLength(props.posts.length);
      props.posts.forEach((p, i) => expect(blogResults[i]).toHaveTextContent(p.slug));
    });
  });
});
