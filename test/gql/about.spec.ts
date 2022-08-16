import getAboutPage, { AboutPage } from "../../src/gql/about";
import { client } from "../../src/gql/client";

// cSpell:words abouts

jest.mock("../../src/gql/client");

describe("gql about", () => {
  const mockedClient = jest.mocked(client);

  const fakeAboutResult: AboutPage = {
    mainText: {
      html: "This is the main text"
    }
  } as AboutPage;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedClient.request.mockResolvedValue({
      abouts: [fakeAboutResult]
    });
  });

  afterAll(() => jest.restoreAllMocks());

  describe("getAboutPage", () => {
    it("should call request with the correct gql", async () => {
      await getAboutPage();

      const actualGql = mockedClient.request.mock.calls[0][0];
      expect(actualGql).toMatchSnapshot();
    });

    it("should throw if the client returns zero about pages", async () => {
      mockedClient.request.mockResolvedValue({
        abouts: []
      });

      await expect(getAboutPage()).rejects.toThrow("Expected exactly one about page but got 0");
    });

    it("should throw if the client returns more than one about page", async () => {
      mockedClient.request.mockResolvedValue({
        abouts: [fakeAboutResult, fakeAboutResult]
      });

      await expect(getAboutPage()).rejects.toThrow("Expected exactly one about page but got 2");
    });

    it("should return the about page when the client returns exactly one", async () => {
      const aboutPage = await getAboutPage();

      expect(aboutPage).toStrictEqual(fakeAboutResult);
    });
  });
});
