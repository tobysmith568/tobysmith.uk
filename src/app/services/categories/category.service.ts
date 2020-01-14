import { Injectable } from "@angular/core";
import { ICategory } from "src/app/models/posts/category.interface";
import categoryData from "../../data/categories.json";

@Injectable({
  providedIn: "root"
})
export class CategoryService {

  private categories: ICategory[];

  constructor() {
    this.categories = categoryData as ICategory[];
  }

  public getCategory(category: string): ICategory | undefined {
    const parts = category.substring(1).split("/");

    return this.getCategoryWithIndex(parts, this.categories, 0);
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
