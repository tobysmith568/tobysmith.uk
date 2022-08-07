import { render } from "@testing-library/react";
import { ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import getRssFeedData, { Post, RssFeedData } from "../../../src/gql/rss";
import RSS, { getServerSideProps } from "../../../src/pages/blog/rss";
import generateRssFeed from "../../../src/utils/api-only/generate-rss-feed";
import isNotFoundResult from "../../test-helpers/is-not-found-result";
import isRedirectResult from "../../test-helpers/is-redirect-result";

jest.mock("../../../src/gql/rss", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../src/utils/api-only/generate-rss-feed", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("rss", () => {
  const mockedGetRssFeedData = jest.mocked(getRssFeedData);
  const mockedGenerateRssFeed = jest.mocked(generateRssFeed);

  let rssData: RssFeedData;

  let res: ServerResponse;
  let context: GetServerSidePropsContext;

  beforeEach(() => {
    rssData = {
      rss: {
        title: "title"
      },
      posts: [{ slug: "post-1" }, { slug: "post-2" }]
    } as RssFeedData;

    res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    } as unknown as ServerResponse;

    context = {
      res
    } as GetServerSidePropsContext;

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  describe("getServerSideProps", () => {
    it("should get the rss feed data from getRssFeedData", async () => {
      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGetRssFeedData).toHaveBeenCalledTimes(1);
    });

    it("should map post titles correctly to rssItem titles", async () => {
      rssData.posts = [{ title: "Post 1" }, { title: "Post 2" }] as Post[];

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];
      const rssItems = firstCallFirstArg.items;

      expect(rssItems).toHaveLength(2);
      rssItems.forEach((r, i) => expect(r.title).toBe(rssData.posts[i].title));
    });

    it("should map post excerpts correctly to rssItem descriptions", async () => {
      rssData.posts = [{ excerpt: "Post 1 excerpt" }, { excerpt: "Post 2 excerpt" }] as Post[];

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];
      const rssItems = firstCallFirstArg.items;

      expect(rssItems).toHaveLength(2);
      rssItems.forEach((r, i) => expect(r.description).toBe(rssData.posts[i].excerpt));
    });

    it("should map post slugs correctly to rssItem urls", async () => {
      rssData.posts = [{ slug: "post-1" }, { slug: "post-2" }] as Post[];
      rssData.rss.siteUrl = "site-url";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];
      const rssItems = firstCallFirstArg.items;

      expect(rssItems).toHaveLength(2);
      rssItems.forEach((r, i) =>
        expect(r.url).toBe(`${rssData.rss.siteUrl}/${rssData.posts[i].slug}`)
      );
    });

    it("should map post dates correctly to rssItem dates", async () => {
      rssData.posts = [{ date: "2020-01-01" }, { date: "2020-01-02" }] as Post[];

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];
      const rssItems = firstCallFirstArg.items;

      expect(rssItems).toHaveLength(2);
      rssItems.forEach((r, i) => expect(r.date).toBe(rssData.posts[i].date));
    });

    it("should map the rss title correctly", async () => {
      rssData.rss.title = "RSS title";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.title).toBe(rssData.rss.title);
    });

    it("should map the rss siteUrl correctly", async () => {
      rssData.rss.siteUrl = "site-url";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.siteUrl).toBe(rssData.rss.siteUrl);
    });

    it("should map the rss feedUrl correctly", async () => {
      rssData.rss.feedUrl = "feed-url";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.feedUrl).toBe(rssData.rss.feedUrl);
    });

    it("should map the rss description correctly", async () => {
      rssData.rss.description = "RSS description";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.description).toBe(rssData.rss.description);
    });

    it("should map the rss language correctly", async () => {
      rssData.rss.language = "en-GB";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.language).toBe(rssData.rss.language);
    });

    it("should map the rss timeToLive correctly", async () => {
      rssData.rss.timeToLive = 60;

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.timeToLive).toBe(rssData.rss.timeToLive);
    });

    it("should map the rss webmaster properly", async () => {
      rssData.rss.webmaster = "test webmaster";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.webmaster).toBe(rssData.rss.webmaster);
    });

    it("should map the rss copyright properly", async () => {
      rssData.rss.copyright = "test copyright";

      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(mockedGenerateRssFeed).toHaveBeenCalledTimes(1);

      const firstCallFirstArg = mockedGenerateRssFeed.mock.calls[0][0];

      expect(firstCallFirstArg.copyright).toBe(rssData.rss.copyright);
    });

    it("should set the content type header to xml", async () => {
      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(context.res.setHeader).toHaveBeenCalledTimes(1);
      expect(context.res.setHeader).toHaveBeenCalledWith("Content-Type", "application/xml");
    });

    it("should write the result of the rss feed generation to the body", async () => {
      mockedGetRssFeedData.mockResolvedValue(rssData);
      mockedGenerateRssFeed.mockReturnValue("test rss feed");

      await getServerSideProps(context);

      expect(context.res.write).toHaveBeenCalledTimes(1);
      expect(context.res.write).toHaveBeenCalledWith("test rss feed");
    });

    it("should end the response", async () => {
      mockedGetRssFeedData.mockResolvedValue(rssData);

      await getServerSideProps(context);

      expect(context.res.end).toHaveBeenCalledTimes(1);
    });

    it("should return empty props", async () => {
      mockedGetRssFeedData.mockResolvedValue(rssData);

      const result = await getServerSideProps(context);

      if (isNotFoundResult(result) || isRedirectResult(result)) {
        throw new Error("Result should not be a not found or redirect result");
      }

      expect(result.props).toEqual({});
    });
  });

  describe("RSS", () => {
    it("should render null", () => {
      const { container } = render(<RSS />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
