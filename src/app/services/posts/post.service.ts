import { Injectable } from "@angular/core";
import { IPost } from "src/app/models/posts/post.interface";
import postData from "../../data/posts.json";

@Injectable({
  providedIn: "root"
})
export class PostService {

  private readonly posts: IPost[];

  constructor() {
    this.posts = postData as IPost[];
  }

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
