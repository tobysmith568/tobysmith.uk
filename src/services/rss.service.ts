import { singleton } from "tsyringe";
import { EnvironmentService } from "./environment.service";
import Rss from "rss";

@singleton()
export class RssService {
  constructor(private readonly environmentService: EnvironmentService) {}

  public getRssFeed(feedData: RssFeed): string {
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
  }
}

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
