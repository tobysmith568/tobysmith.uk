import * as fs from "fs";
import { ScriptUtils as SU } from "./scriptUtils";
import { ITag } from "src/app/models/posts/tag.interface";

/* Constants */

const tagData = "src/app/data/tags.json";

/* Functions */

function checkTags(tags: ITag[]) {
  for (const tag of tags) {
    if (!checkTagName(tag.name)) {
      continue;
    }

    if (tag.aliases) {
      for (const alias of tag.aliases) {
        if (!checkTagName(alias)) {
          continue;
        }
      }
    }
  }
}

function checkTagName(tagName: string): boolean {
  if (!tagName || tagData.length === 0) {
    SU.error("A tag name or alias cannot be null, undefined, or empty");
    return false;
  }

  if (tagName.includes(" ")) {
    SU.error(`Tag name or alias ${tagName} cannot contain a space`);
    return false;
  }

  if (tagName !== tagName.toLowerCase()) {
    SU.error(`Tag name or alias ${tagName} can only contain lowercase characters`);
    return false;
  }

  return true;
}

/* Script */

SU.startsection("Checking Tags");

const data = fs.readFileSync(tagData, "utf8");

const allTags: ITag[] = JSON.parse(data);

const slugs: string[] = [];

checkTags(allTags);

SU.testFail();
