import { Injectable } from "@angular/core";
import { IPost } from "src/app/models/posts/post";

@Injectable({
  providedIn: "root"
})
export class PostService {

  private posts: IPost[] = [
    {
      author: "Toby Smith",
      categories: [
        "projects/windows"
      ],
      contentPath: "this-is-a-post.md",
      date: "2020/01/09 15:30",
      preview: "Once apon a time, I wrote a post about some stuff. This is that post",
      slug: "something",
      title: "This post is about something"
    },
    {
      author: "Toby Smith",
      categories: [
        "projects/websites"
      ],
      contentPath: "this-is-a-post.md",
      date: "2020/01/09 15:30",
      preview: "Are you ready kids? Aye, aye, Captain! OHHHHHHHHHHHHHHHHHH",
      slug: "somethingAlso",
      title: "This post is not about windows"
    },
    {
      author: "Toby Smith",
      categories: [
        "projects/windows"
      ],
      contentPath: "this-is-also-a-post.md",
      date: "2020/01/09 15:30",
      preview: "In the criminal justice system, the people are represented by two separate, yet equally important, groups: the police, who investigate crime; and the district attorneys, who prosecute the offenders. These are their stories.",
      slug: "something2",
      title: "This post is about something else"
    },
    {
      author: "Toby Smith",
      categories: [
        "projects/windows"
      ],
      contentPath: "this-is-also-a-post.md",
      date: "2020/01/09 15:30",
      slug: "something3",
      title: "I am a post"
    },
    {
      categories: [
        "projects/windows"
      ],
      externalLink: "https://bbc.co.uk",
      preview: "Click me with your rhythm stick",
      title: "I am an external link"
    }
  ] as IPost[];

  constructor() { }

  public getPostsInCategory(category: string): IPost[] {
    const foundPosts: IPost[] = [];

    for (const post of this.posts) {
      for (const postCategory of post.categories) {
        if (("/" + postCategory).startsWith(category)) {
          foundPosts.push(post);
          break;
        }
      }
    }

    return foundPosts;
  }

  public getPost(slug: string): IPost | undefined {
    for (const post of this.posts) {
      if (post.slug === slug) {
        return post;
      }
    }

    return undefined;
  }
}
