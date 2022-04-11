import { GetServerSideProps } from "next";
import Rss from "rss";
import getRssFeedData from "../../gql/rss";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!res) {
    return { notFound: true };
  }

  const rssData = await getRssFeedData();

  const feedItems = rssData.posts.map<RssItem>(post => ({
    title: post.title,
    description: post.excerpt,
    url: `${rssData.rss.siteUrl}/${post.slug}`,
    date: post.date
  }));

  const feedData: RssFeed = {
    title: rssData.rss.title,
    siteUrl: rssData.rss.siteUrl,
    feedUrl: rssData.rss.feedUrl,
    description: rssData.rss.description,
    language: rssData.rss.language,
    timeToLive: rssData.rss.timeToLive,
    webmaster: rssData.rss.webmaster,
    copyright: rssData.rss.copyright,
    items: feedItems
  };

  const rssFeedText = getRssFeedText(feedData);

  res.setHeader("Content-Type", "application/xml");
  res.write(rssFeedText);
  res.end();

  return { props: {} };
};

export interface RssFeed {
  title: string;
  siteUrl: string;
  feedUrl: string;
  description?: string;
  language?: string;
  timeToLive?: number;
  webmaster?: string;
  copyright?: string;
  items: RssItem[];
}

export interface RssItem {
  title: string;
  description: string;
  url: string;
  date: string;
}

const getRssFeedText = (feedData: RssFeed): string => {
  const feed = new Rss({
    title: feedData.title,
    feed_url: feedData.feedUrl,
    site_url: feedData.siteUrl,
    description: feedData.description,
    language: feedData.language,
    ttl: feedData.timeToLive,
    webMaster: feedData.webmaster,
    copyright: feedData.copyright
  });

  for (const item of feedData.items) {
    feed.item({
      title: item.title,
      description: item.description,
      url: item.url,
      date: item.date
    });
  }

  return feed.xml();
};

const RSS: React.FC = () => null;
export default RSS;
