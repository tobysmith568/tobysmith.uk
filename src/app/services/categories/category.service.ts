import { Injectable } from "@angular/core";
import { ICategory } from "src/app/models/posts/category.interface";

@Injectable({
  providedIn: "root"
})
export class CategoryService {

  private categories: ICategory[] = [
    {
      name: "projects",
      description: "These are projects which I have developed in my free time.",
      children: [
        {
          name: "windows",
          description: "These projects are windows applications, typically built in WPF"
        },
        {
          name: "websites",
          description: "These projects are websites or web utilities that I have developed"
        },
        {
          name: "alexa",
          description: "These are Skills I have made for Amazon’s personal assistant, Alexa."
        }
      ]
    }
  ] as ICategory[];

  constructor() { }

  public getCategory(category: string): ICategory | undefined {
    const parts = category.substring(1).split("/");

    return this.getDescriptionWithIndex(parts, this.categories, 0);
  }

  private getDescriptionWithIndex(parts: string[], categories: ICategory[], index: number): ICategory | undefined {
    for (const child of categories) {
      if (child.name === parts[index] && index === parts.length - 1) {
        return child;
      }

      if (child.name === parts[index]) {
        return this.getDescriptionWithIndex(parts, child.children, index + 1);
      }
    }

    return undefined;
  }
}
