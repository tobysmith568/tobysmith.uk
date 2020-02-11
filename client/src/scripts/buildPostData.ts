import * as del from "del";
import * as fs from "fs";
import * as p from "path";
import { ScriptUtils as SU } from "./scriptUtils";
import { MarkdownService } from "./markdown.service";
import { Post } from "src/app/models/posts/post.interface";

/* Constants */

const codeGenFolder = "src/app/data/generated";
const assetGenFolder = "src/assets/generated-posts";

const postDataFolder = "src/app/data/posts/info/";
const postContentFolder = "src/app/data/posts/content/";
const postDataOutputFile = "src/app/data/generated/posts.json";

const markdownService = new MarkdownService();

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

function parseData(data: string): Post {
  return JSON.parse(data, (key: string, value: any) => {
    if (key.toLowerCase() === "date") {

      const date = new Date(value);

      if (!date.toJSON()) {
        return null;
      }

      return date;
    }
    return value;
  }) as Post;
}

/* Script */

SU.startsection("Building Posts");

del.sync(codeGenFolder);
fs.mkdirSync(codeGenFolder);

del.sync(assetGenFolder);
fs.mkdirSync(assetGenFolder);

const postFiles = getFiles(postDataFolder);

const posts: Post[] = [];
const slugs: string[] = [];

postFiles.forEach(file => {
  const data: string = fs.readFileSync(file, "utf8");
  const post: Post = parseData(data);

  const markdownFilePath = postContentFolder + post.contentPath + ".md";

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

  if (!post.contentPath && !post.externalLink && !post.internalLink) {
    SU.error(`${file} has no content path, external link, or internal link`);
  }

  if (post.contentPath && !fs.existsSync(markdownFilePath)) {
    SU.error(`The content path ${markdownFilePath} in file ${file} could not be found`);
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

  if (post.tags) {
    for (const [i, tag] of post.tags.entries()) {
      const originalTag = tag;

      post.tags[i] = tag.replace(" ", "-").toLowerCase();

      if (originalTag !== post.tags[i]) {
        SU.warn(`Tag ${originalTag} in file ${file} was changed to ${tag}`);
      }
    }
  }

  slugs.push(post.slug.toLowerCase());
  posts.push(post);

  if (post.contentPath) {
    const markdown: string = fs.readFileSync(markdownFilePath, "utf8");
    const html = markdownService.toHTML(markdown);

    const newFileName = assetGenFolder + "/" + p.parse(post.contentPath).name + ".html";

    fs.writeFileSync(newFileName, html);
  }
});

SU.testFail();

posts.sort((a, b) => (a.date > b.date) ? -1 : 1);

if (process.argv.length > 2 && process.argv[2].includes("prod")) {
  fs.writeFileSync(postDataOutputFile, JSON.stringify(posts));
} else {
  fs.writeFileSync(postDataOutputFile, JSON.stringify(posts, null, 2));
}
