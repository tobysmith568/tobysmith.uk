import { IPost } from "./posts/post";

export class PostConfig {
  public static posts: IPost[] = [
    {
      author: "Toby Smith",
      categories: [
        "projects/windows"
      ],
      contentPath: "this-is-a-post.md",
      date: "2020/01/09 15:30",
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
      slug: "something",
      title: "This post is not about windows"
    },
    {
      author: "Toby Smith",
      categories: [
        "projects/windows"
      ],
      contentPath: "this-is-also-a-post.md",
      date: "2020/01/09 15:30",
      slug: "something2",
      title: "This post is about something else"
    }
  ] as IPost[];
}
