import { Injectable } from "@angular/core";
import { ICategory } from "src/app/models/posts/category.interface";
import categoryData from "../../data/categories.json";
import tagData from "../../data/tags.json";
import { ITag } from "src/app/models/posts/tag.interface.js";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class CategoryService {

  private categories: ICategory[];
  private tags: ITag[];

  constructor() {
    this.categories = categoryData as ICategory[];
    this.tags = tagData as ITag[];
  }

  public getCategory(category: string): ICategory | undefined {
    const parts = category.substring(1).split("/");

    return this.getCategoryWithIndex(parts, this.categories, 0);
  }

  public getTag(wantedTag: string): ITag | undefined {
    for (const tag of this.tags) {
      if (tag.name === wantedTag || (!isNullOrUndefined(tag.aliases) && tag.aliases.includes(wantedTag))) {
        return tag;
      }
    }

    return undefined;
  }

  private getCategoryWithIndex(parts: string[], categories: ICategory[], index: number): ICategory | undefined {
    for (const child of categories) {
      if (child.slug === parts[index] && index === parts.length - 1) {
        return child;
      }

      if (child.slug === parts[index]) {
        return this.getCategoryWithIndex(parts, child.children, index + 1);
      }
    }

    return undefined;
  }
}
