import getBlogSearchPosts, { BlogResponse } from "../../src/gql/blog-search";
import { client } from "../../src/gql/client";

jest.mock("../../src/gql/client");

describe("gql blog search", () => {
  const searchTerm = "This is the search term";

  const mockedClient = jest.mocked(client);

  const fakeBlogResponse: BlogResponse = {
    postPages: [{ seo: { title: "SEO title" } }],
    posts: [{ title: "Post title" }]
  } as BlogResponse;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedClient.request.mockResolvedValue(fakeBlogResponse);
  });

  afterAll(jest.restoreAllMocks);

  describe("getBlogSearchPosts", () => {
    it("should call request with the correct gql", async () => {
      await getBlogSearchPosts(searchTerm);

      const actualGql = mockedClient.request.mock.calls[0][0];
      expect(actualGql).toMatchSnapshot();
    });

    it("should throw if the client returns zero post pages", async () => {
      mockedClient.request.mockResolvedValue({
        postPages: []
      });

      await expect(getBlogSearchPosts(searchTerm)).rejects.toThrowError(
        "Expected exactly one postPage but got 0"
      );
    });

    it("should throw if the client returns more than one postPage", async () => {
      mockedClient.request.mockResolvedValue({
        postPages: [fakeBlogResponse, fakeBlogResponse]
      });

      await expect(getBlogSearchPosts(searchTerm)).rejects.toThrowError(
        "Expected exactly one postPage but got 2"
      );
    });

    it("should return the seo of the postPage when the client returns exactly one", async () => {
      const { seo } = await getBlogSearchPosts(searchTerm);

      expect(seo).toStrictEqual(fakeBlogResponse.postPages[0].seo);
    });

    it("should return the posts when the client returns exactly one postPage", async () => {
      const { posts } = await getBlogSearchPosts(searchTerm);

      expect(posts).toStrictEqual(fakeBlogResponse.posts);
    });
  });
});
