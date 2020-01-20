import * as del from "del";
import * as fs from "fs";
import { ScriptUtils as SU } from "./scriptUtils";
import { IPost } from "src/app/models/posts/post.interface";

/* Constants */

const genFolder = "src/app/generated";
const postFolder = "src/app/data/posts";
const postFile = "src/app/generated/posts.json";
const postContent = "src/assets/posts/";

/* Functions */

function getFiles(path: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(path);

  list.forEach(file => {
    file = path + "/" + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

function parseData(data: string): IPost {
  return JSON.parse(data, (key: string, value: any) => {
    if (key.toLowerCase() === "date") {

      const date = new Date(value);

      if (!date.toJSON()) {
        return null;
      }

      return date;
    }
    return value;
  }) as IPost;
}

/* Script */

SU.startsection("Building Posts");

del.sync(genFolder);
fs.mkdirSync(genFolder);

const postFiles = getFiles(postFolder);

const posts: IPost[] = [];
const slugs: string[] = [];

postFiles.forEach(file => {
  const data: string = fs.readFileSync(file, "utf8");
  const post: IPost = parseData(data);

  if (!post.slug) {
    SU.error(`Slug in ${file} is empty or not present`);
  }

  if (slugs.includes(post.slug.toLowerCase())) {
    SU.error(`${file} is trying to use the slug ${post.slug} which is already used`);
  }

  if (!post.slug.match(/^[a-zA-Z0-9-]*$/)) {
    SU.error(`Slug in ${file} contains invalid characters`);
  }

  if (!post.author) {
    SU.warn(`Author in file ${file} is empty or not present`);
  }

  if (!post.categories || post.categories.length === 0) {
    SU.error(`Categories in file ${file} is empty or not present`);
  }

  if (!post.contentPath && !post.externalLink) {
    SU.error(`${file} has no content path or external link`);
  }

  if (post.contentPath && !fs.existsSync(postContent + post.contentPath)) {
    SU.error(`The content path ${post.contentPath} in file ${file} could not be found`);
  }

  if (!post.date) {
    SU.error(`Date in file ${file} is empty, not present, or invalid`);
  }

  if (!post.preview) {
    SU.warn(`Preview in file ${file} is empty or not present`);
  }

  if (!post.slug && !post.externalLink) {
    SU.error(`${file} has no slug or external link`);
  }

  if (!post.title) {
    SU.warn(`Title in file ${file} is empty or not present`);
  }

  slugs.push(post.slug.toLowerCase());
  posts.push(post);
});

SU.testFail();

posts.sort((a, b) => (a.date > b.date) ? -1 : 1);

if (process.argv.length > 2 && process.argv[2].includes("prod")) {
  fs.writeFileSync(postFile, JSON.stringify(posts));
} else {
  fs.writeFileSync(postFile, JSON.stringify(posts, null, 2));
}
