import * as fs from "fs";
import { ScriptUtils as SU } from "./scriptUtils";
import { ICategory } from "src/app/models/posts/category.interface";

/* Constants */

const categoryData = "src/app/data/categories.json";

/* Functions */

function checkCategories(categories: ICategory[], prefix: string) {
  for (const category of categories) {
    if (!category.slug) {
      SU.error("Category found without a slug.");
      continue;
    }

    const fullname = prefix + "/" + category.slug.toLowerCase();

    if (category.slug.includes(" ")) {
      SU.error(`Slug ${fullname} contains a space`);
    }

    if (slugs.includes(fullname)) {
      SU.error(`The slug ${category.slug} is used multiple times`);
    }

    if (category.children) {
      checkCategories(category.children, fullname);
    }

    slugs.push(fullname);
  }
}

/* Script */

SU.startsection("Checking Categories");

const data = fs.readFileSync(categoryData, "utf8");

const allCategories: ICategory[] = JSON.parse(data);

const slugs: string[] = [];

checkCategories(allCategories, "");

SU.testFail();
