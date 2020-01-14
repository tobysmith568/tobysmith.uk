import * as del from "del";
import * as fs from "fs";
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

function warn(message: string) {
  console.warn("\x1b[33m", message, "\x1b[0m");
}

function error(message: string) {
  console.error("\x1b[31m", message, "\x1b[0m");
}

/* Script */

del.sync(genFolder);
fs.mkdirSync(genFolder);

const postFiles = getFiles(postFolder);

const posts: IPost[] = [];
const slugs: string[] = [];
let hasErrored = false;

postFiles.forEach(file => {
  const data = fs.readFileSync(file, "utf8");
  const post = JSON.parse(data) as IPost;

  if (slugs.includes(post.slug)) {
    warn(`Duplicate posts found with the slug: ${post.slug}. ${file} is overwriting something`);
  }

  if (!post.author) {
    warn(`Author in file ${file} is empty or not present`);
  }

  if (post.categories === undefined || post.categories.length === 0) {
    error(`Categories in file ${file} is empty or not present`);
    hasErrored = true;
  }

  if (!post.contentPath && !post.externalLink) {
    error(`${file} has no content path or external link`);
    hasErrored = true;
  }

  if (post.contentPath && !fs.existsSync(postContent + post.contentPath)) {
    error(`The content path ${post.contentPath} in file ${file} could not be found`);
    hasErrored = true;
  }

  if (!post.date) {
    error(`Date in file ${file} is empty or not present`);
    hasErrored = true;
  }

  if (!post.preview) {
    warn(`Preview in file ${file} is empty or not present`);
  }

  if (!post.slug && !post.externalLink) {
    error(`${file} has no slug or external link`);
    hasErrored = true;
  }

  if (!post.title) {
    warn(`Title in file ${file} is empty or not present`);
  }

  slugs.push(post.slug);
  posts.push(post);
});

if (hasErrored) {
  process.exit(1);
}

posts.sort((a, b) => (a.date > b.date) ? 1 : -1);

if (process.argv.length > 2 && process.argv[2].includes("prod")) {
  fs.writeFileSync(postFile, JSON.stringify(posts));
} else {
  fs.writeFileSync(postFile, JSON.stringify(posts, null, 2));
}
