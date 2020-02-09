import { Injectable } from "@angular/core";
import { Post } from "src/app/models/posts/post.interface";
import postData from "../../data/generated/posts.json";
import { CategoryService } from "../categories/category.service.js";
import { ITag } from "src/app/models/posts/tag.interface.js";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class PostService {

  private readonly posts: Post[];

  constructor(private readonly categoryService: CategoryService) {

    this.posts = [];
    for (const post of postData) {
      const newPost = new Post();
      newPost.author = post.author;
      newPost.categories = post.categories;
      newPost.contentPath = post.contentPath;
      newPost.date = new Date(post.date);
      newPost.downloads = post.downloads;
      newPost.external = post.external;
      newPost.externalLink = undefined; // TODO post.externalLink;
      newPost.github = post.github;
      newPost.internalLink = post.internalLink;
      newPost.itch = post.itch;
      newPost.nuget = post.nuget;
      newPost.preview = post.preview;
      newPost.previewImage = post.previewImage;
      newPost.skill = post.skill;
      newPost.slug = post.slug;
      newPost.tags = post.tags;
      newPost.title = post.title;

      this.posts.push(newPost);
    }
  }

  public getPostsInCategory(category: string, max?: number): Post[] {
    const foundPosts: Post[] = [];

    for (const post of this.posts) {
      for (const postCategory of post.categories) {
        if (("/" + postCategory).startsWith(category)) {
          foundPosts.push(post);

          if (foundPosts.length === max) {
            return foundPosts;
          }
          break;
        }
      }
    }

    return foundPosts;
  }

  public getPostsWithTag(tag: ITag, max?: number): Post[] {

    const foundPosts: Post[] = [];

    for (const post of this.posts) {
      if (!post.tags) {
        continue;
      }

      for (const postTag of post.tags) {
        if (postTag === tag.name || (!isNullOrUndefined(tag.aliases) && tag.aliases.includes(postTag))) {
          foundPosts.push(post);

          if (foundPosts.length === max) {
            return foundPosts;
          }
          break;
        }
      }
    }

    return foundPosts;
  }

  public getPostsWithTagName(tag: string, max?: number): Post[] {

    const foundPosts: Post[] = [];

    for (const post of this.posts) {
      if (!post.tags) {
        continue;
      }
      
      for (const postTag of post.tags) {
        if (postTag === tag) {
          foundPosts.push(post);

          if (foundPosts.length === max) {
            return foundPosts;
          }
          break;
        }
      }
    }

    return foundPosts;
  }

  public getPost(slug: string): Post | undefined {
    for (const post of this.posts) {
      if (post.slug === slug) {
        return post;
      }
    }

    return undefined;
  }
}
