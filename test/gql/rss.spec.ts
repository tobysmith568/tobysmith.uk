import { client } from "../../src/gql/client";
import getRssFeedData, { RssFeedData } from "../../src/gql/rss";

jest.mock("../../src/gql/client");

describe("gql rss", () => {
  const mockedClient = jest.mocked(client);

  const fakeRssResult: RssFeedData = {
    rss: {
      title: "My RSS Feed"
    },
    posts: [{ title: "Post #1" }, { title: "Post #2" }]
  } as RssFeedData;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedClient.request.mockResolvedValue(fakeRssResult);
  });

  afterAll(() => jest.restoreAllMocks());

  describe("getRssFeedData", () => {
    it("should call request with the correct gql", async () => {
      await getRssFeedData();

      const actualGql = mockedClient.request.mock.calls[0][0];
      expect(actualGql).toMatchSnapshot();
    });

    it("should throw if the client returns undefined", async () => {
      mockedClient.request.mockResolvedValue(undefined);

      await expect(getRssFeedData()).rejects.toThrow("Unable to get RSS data");
    });

    it("should return the rss data when the client returns it", async () => {
      const rssData = await getRssFeedData();

      expect(rssData).toStrictEqual(fakeRssResult);
    });
  });
});
