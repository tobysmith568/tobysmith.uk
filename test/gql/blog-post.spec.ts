import getBlogPost, { BlogPost } from "../../src/gql/blog-post";
import { client } from "../../src/gql/client";
import highlightCode from "../../src/utils/api-only/highlight-code";

jest.mock("../../src/gql/client");
jest.mock("../../src/utils/api-only/highlight-code");

type ClientRequest = (query: string, variables?: any) => Promise<any>;

describe("gql blog-post", () => {
  const mockedClientRequest = jest.mocked(client.request as ClientRequest);
  const mockedHighlightCode = jest.mocked(highlightCode);

  const postSlugs = ["post-1", "post-2"];

  const createFakeBlogPostResult = (slug: string): BlogPost =>
    ({
      content: {
        html: `This is the main text for slug: ${slug}`
      }
    } as BlogPost);

  beforeEach(() => {
    jest.resetAllMocks();

    mockedHighlightCode.mockImplementation(input => `Highlighted:{${input}}`);
  });

  afterAll(() => jest.restoreAllMocks());

  postSlugs.forEach(postSlug =>
    describe(`getBlogPost with slug "${postSlug}"`, () => {
      beforeEach(() => {
        mockedClientRequest.mockResolvedValue({
          post: createFakeBlogPostResult(postSlug)
        });
      });

      it("should call request with the correct gql", async () => {
        await getBlogPost(postSlug);

        const actualGql = mockedClientRequest.mock.calls[0][0];
        expect(actualGql).toMatchSnapshot();
      });

      it("should call request with the correct variables", async () => {
        await getBlogPost(postSlug);

        const actualVariables = mockedClientRequest.mock.calls[0][1];
        expect(actualVariables).toStrictEqual({
          slug: postSlug
        });
      });

      it("should throw if the client returns an undefined blog post", async () => {
        mockedClientRequest.mockResolvedValue({
          post: undefined
        });

        await expect(getBlogPost(postSlug)).rejects.toThrow(
          `Could not find a blog post with the slug ${postSlug}`
        );
      });

      it("should highlight the html content of the returned post when the client returns exactly one", async () => {
        await getBlogPost(postSlug);

        expect(mockedHighlightCode).toHaveBeenCalledWith(
          createFakeBlogPostResult(postSlug).content.html
        );
      });

      it("should return the blog post with highlights when the client returns exactly one", async () => {
        const expectedResult = createFakeBlogPostResult(postSlug);
        expectedResult.content.html = `Highlighted:{${expectedResult.content.html}}`;

        const blogPost = await getBlogPost(postSlug);

        expect(blogPost).toStrictEqual(expectedResult);
      });
    })
  );
});
