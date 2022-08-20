import { client } from "../../src/gql/client";
import getProject, { Project } from "../../src/gql/project";
import highlightCode from "../../src/utils/api-only/highlight-code";

jest.mock("../../src/gql/client");
jest.mock("../../src/utils/api-only/highlight-code");

type ClientRequest = (query: string, variables?: any) => Promise<any>;

describe("gql project", () => {
  const mockedClientRequest = jest.mocked(client.request as ClientRequest);
  const mockedHighlightCode = jest.mocked(highlightCode);

  const projectSlugs = ["project-1", "project-2"];

  const createFakeProjectResult = (slug: string): Project =>
    ({
      content: {
        html: `This is the main text for slug: ${slug}`
      }
    } as Project);

  beforeEach(() => {
    jest.resetAllMocks();

    mockedHighlightCode.mockImplementation(input => `Highlighted:{${input}}`);
  });

  afterAll(() => jest.restoreAllMocks());

  projectSlugs.forEach(projectSlug =>
    describe(`getProject with slug "${projectSlug}"`, () => {
      beforeEach(() => {
        mockedClientRequest.mockResolvedValue({
          project: createFakeProjectResult(projectSlug)
        });
      });

      it("should call request with the correct gql", async () => {
        await getProject(projectSlug);

        const actualGql = mockedClientRequest.mock.calls[0][0];
        expect(actualGql).toMatchSnapshot();
      });

      it("should call request with the correct variables", async () => {
        await getProject(projectSlug);

        const actualVariables = mockedClientRequest.mock.calls[0][1];
        expect(actualVariables).toStrictEqual({
          slug: projectSlug
        });
      });

      it("should throw if the client returns an undefined project", async () => {
        mockedClientRequest.mockResolvedValue({
          post: undefined
        });

        await expect(getProject(projectSlug)).rejects.toThrow(
          `Could not find a project with the slug ${projectSlug}`
        );
      });

      it("should highlight the html content of the returned project when the client returns exactly one", async () => {
        await getProject(projectSlug);

        expect(mockedHighlightCode).toHaveBeenCalledWith(
          createFakeProjectResult(projectSlug).content.html
        );
      });

      it("should return the project with highlights when the client returns exactly one", async () => {
        const expectedResult = createFakeProjectResult(projectSlug);
        expectedResult.content.html = `Highlighted:{${expectedResult.content.html}}`;

        const blogPost = await getProject(projectSlug);

        expect(blogPost).toStrictEqual(expectedResult);
      });
    })
  );
});
