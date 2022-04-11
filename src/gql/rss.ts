import { client, gql } from "./client";

interface RssFeedData {
  rss: Rss;
  posts: Post[];
}

interface Rss {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  language: string;
  timeToLive: number;
  webmaster: string;
  copyright: string;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

const getRssFeedData = async (): Promise<RssFeedData> => {
  const query = gql`
    query GetRss {
      rss(where: { type: "blog" }) {
        title
        description
        siteUrl
        feedUrl
        language
        timeToLive
        webmaster
        copyright
      }
      posts(orderBy: date_DESC, where: { OR: [{ devOnly: null }, { devOnly: false }] }) {
        slug
        title
        date
        excerpt
      }
    }
  `;

  const rssData = await client.request<RssFeedData>(query);

  if (!rssData) {
    throw new Error("Unable to get RSS data");
  }

  return rssData;
};
export default getRssFeedData;
