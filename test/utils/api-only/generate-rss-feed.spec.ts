import getRssFeedText from "../../../src/utils/api-only/generate-rss-feed";

describe("generate-rss-feed", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.UTC(2022, 7, 1, 21, 30));
  });

  afterAll(() => jest.useRealTimers());

  describe("getRssFeedText", () => {
    it("should generate an rss feed from the given parameters", () => {
      const result = getRssFeedText({
        title: "Feed title",
        feedUrl: "https://feed.url",
        siteUrl: "https://site.url",
        description: "Feed description",
        language: "Feed language",
        timeToLive: 7,
        webmaster: "Feed webmaster",
        copyright: "Feed copyright",
        items: [
          {
            title: "Item #1 title",
            description: "Item #1 description",
            url: "https://item1.url",
            date: "Item #1 date"
          },
          {
            title: "Item #2 title",
            description: "Item #2 description",
            url: "https://item2.url",
            date: "Item #2 date"
          }
        ]
      });

      expect(result).toMatchSnapshot();
    });
  });
});
