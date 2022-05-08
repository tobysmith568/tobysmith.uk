import { GetServerSideProps } from "next";
import getRssFeedData from "../../gql/rss";
import generateRssFeed, { RssFeed, RssItem } from "../../utils/api-only/generate-rss-feed";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
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

  const rssFeedText = generateRssFeed(feedData);

  res.setHeader("Content-Type", "application/xml");
  res.write(rssFeedText);
  res.end();

  return { props: {} };
};

const RSS: React.FC = () => null;
export default RSS;
