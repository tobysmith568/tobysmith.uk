import { screen } from "@testing-library/react";
import BlogResult from "../../../src/components/blog/blog-result";
import { Post } from "../../../src/gql/blog";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("../../../src/components/formatted-date", () => ({
  __esModule: true,
  default: (props: any) => <>{props.dateValue}</>
}));

describe("blog-result", () => {
  let post: Post;

  beforeEach(() => {
    post = {
      title: "Test title",
      slug: "test-title",
      date: "2020-01-01",
      excerpt: "Test excerpt"
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<BlogResult post={post} />);

  describe("link", () => {
    it("should link to the blog post slug", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveAttribute("href", `/blog/${post.slug}`);
    });

    it("should include the post title in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(post.title));
    });

    it("should include the post date in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(post.date));
    });

    it("should include the post excerpt in the link", () => {
      render();

      const title = screen.getByRole("link");

      expect(title).toHaveTextContent(new RegExp(post.excerpt));
    });
  });
});
