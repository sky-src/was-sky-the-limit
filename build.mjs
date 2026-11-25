import fs from "node:fs";
import { marked } from "marked";

function readPost(file) {
  const text = fs.readFileSync(`posts/${file}`, "utf8").replaceAll("\r\n", "\n");
  const split = text.indexOf("\n\n");
  const post = { slug: file.replace(".md", ""), html: marked.parse(text.slice(split)) };

  for (const line of text.slice(0, split).split("\n")) {
    const colon = line.indexOf(":");
    post[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return post;
}

const posts = fs.readdirSync("posts")
  .filter((file) => file.endsWith(".md"))
  .map(readPost)
  .sort((a, b) => b.date.localeCompare(a.date));

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="style.css">
<main>${body}</main>
</html>`;

fs.mkdirSync("site", { recursive: true });

for (const post of posts) {
  const body = `<a href="index.html">back</a><h1>${post.title}</h1><time>${post.date}</time>${post.html}`;
  fs.writeFileSync(`site/${post.slug}.html`, page(post.title, body));
}

const list = posts
  .map((post) => `<li><time>${post.date}</time> <a href="${post.slug}.html">${post.title}</a></li>`)
  .join("");
fs.writeFileSync("site/index.html", page("What if the sky wasn't the limit?", `<h1>What if the sky wasn't the limit?</h1><ul>${list}</ul>`));

if (fs.existsSync("style.css")) fs.copyFileSync("style.css", "site/style.css");