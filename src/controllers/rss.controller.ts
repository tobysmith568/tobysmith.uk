import { gql } from "@apollo/client/core";
import { Router, Request, Response } from "express";
import { ApolloService } from "src/services/apollo.service";
import { ExpressService } from "src/services/express.service";
import { RssFeed, RssItem, RssService } from "src/services/rss.service";
import { singleton } from "tsyringe";
import { IController } from "./controller.interface";

@singleton()
export class RssController implements IController {
  private readonly router: Router;

  constructor(
    expressService: ExpressService,
    private readonly apolloService: ApolloService,
    private readonly rssService: RssService
  ) {
    this.router = expressService.createRouter();

    this.router.get("", (req, res) => this.getRssFeed(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async getRssFeed(req: Request, res: Response): Promise<void> {
    const response = await this.apolloService.query<GqlResponse>(postGqlQuery);

    const feedItems = response.posts.map<RssItem>(post => ({
      title: post.title,
      description: post.excerpt,
      url: `${response.rss.siteUrl}/${post.slug}`,
      date: post.date
    }));

    const feedData: RssFeed = {
      title: response.rss.title,
      siteUrl: response.rss.siteUrl,
      feedUrl: response.rss.feedUrl,
      description: response.rss.description,
      language: response.rss.language,
      timeToLive: response.rss.timeToLive,
      webmaster: response.rss.webmaster,
      copyright: response.rss.copyright,
      items: feedItems
    };

    const rssFeedText = this.rssService.getRssFeed(feedData);

    res.setHeader("content-type", "application/xml");
    res.send(rssFeedText);
  }
}

const postGqlQuery = gql`
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

interface GqlResponse {
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
