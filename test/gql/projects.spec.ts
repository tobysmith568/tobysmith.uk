import { client } from "../../src/gql/client";
import getProjectsPage, { ProjectsPage } from "../../src/gql/projects";

jest.mock("../../src/gql/client");

type ClientRequest = (query: string, variables?: any) => Promise<any>;

describe("gql projects", () => {
  const mockedClientRequest = jest.mocked(client.request as ClientRequest);

  beforeEach(() => jest.resetAllMocks());

  afterAll(() => jest.restoreAllMocks());

  describe("getProjects", () => {
    it("should call request with the correct gql", async () => {
      mockedClientRequest.mockResolvedValue({
        projectPages: [{}]
      });

      await getProjectsPage();

      const actualGql = mockedClientRequest.mock.calls[0][0];
      expect(actualGql).toMatchSnapshot();
    });

    it("should call request with no variables", async () => {
      mockedClientRequest.mockResolvedValue({
        projectPages: [{}]
      });
      await getProjectsPage();

      const actualVariables = mockedClientRequest.mock.calls[0][1];
      expect(actualVariables).toBeUndefined();
    });

    it("should throw if the client returns zero project pages", async () => {
      mockedClientRequest.mockResolvedValue({
        projectPages: []
      });

      await expect(getProjectsPage()).rejects.toThrow(
        "Expected exactly one project page but got 0"
      );
    });

    it("should throw if the client returns more than one project pages", async () => {
      mockedClientRequest.mockResolvedValue({
        projectPages: [{}, {}]
      });

      await expect(getProjectsPage()).rejects.toThrow(
        "Expected exactly one project page but got 2"
      );
    });

    it("should return the project page when the client returns exactly one", async () => {
      const fakeProjectPage: ProjectsPage = {
        projects: [{ slug: "project1" }]
      } as ProjectsPage;

      mockedClientRequest.mockResolvedValue({
        projectPages: [fakeProjectPage]
      });

      const projectPages = await getProjectsPage();

      expect(projectPages).toStrictEqual(fakeProjectPage);
    });
  });
});
