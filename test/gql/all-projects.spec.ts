import getAllProjectsPage, { AllProjectsPage } from "../../src/gql/all-projects";
import { client } from "../../src/gql/client";

jest.mock("../../src/gql/client");

describe("gql all-projects", () => {
  const mockedClient = jest.mocked(client);

  const fakeAllProjectsResult: AllProjectsPage = {
    categories: [
      { name: "Category 1", items: [] },
      { name: "Category 2", items: [] }
    ]
  } as AllProjectsPage;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedClient.request.mockResolvedValue({
      projectIndexPages: [fakeAllProjectsResult]
    });
  });

  afterAll(() => jest.restoreAllMocks());

  describe("getAllProjectsPage", () => {
    it("should call request with the correct gql", async () => {
      await getAllProjectsPage();

      const actualGql = mockedClient.request.mock.calls[0][0];
      expect(actualGql).toMatchSnapshot();
    });

    it("should throw if the client returns zero all project pages", async () => {
      mockedClient.request.mockResolvedValue({
        projectIndexPages: []
      });

      await expect(getAllProjectsPage()).rejects.toThrow(
        "Expected exactly one all projects page but got 0"
      );
    });

    it("should throw if the client returns more than one all projects page", async () => {
      mockedClient.request.mockResolvedValue({
        projectIndexPages: [fakeAllProjectsResult, fakeAllProjectsResult]
      });

      await expect(getAllProjectsPage()).rejects.toThrow(
        "Expected exactly one all projects page but got 2"
      );
    });

    it("should return the all projects page when the client returns exactly one", async () => {
      const allProjectsPage = await getAllProjectsPage();

      expect(allProjectsPage).toStrictEqual(fakeAllProjectsResult);
    });
  });
});
