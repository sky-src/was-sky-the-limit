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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet">
<title>${title}</title>
<link rel="stylesheet" href="style.css">
<main>${body}</main>
</html>`;

fs.mkdirSync("site", { recursive: true });

for (const post of posts) {
  // post maker 
  const body = `<a class="back" href="index.html">sky</a><h1 class="post-title">${post.title}</h1><time class="time">${post.date}</time>${post.html}`;
  fs.writeFileSync(`site/${post.slug}.html`, page(post.title, body));
}

const list = posts
  .map((post) => `<li class="list-blogs"><time>${post.date}</time> - <a href="${post.slug}.html">${post.title}</a></li>`)
  .join("");
  // main page maker
fs.writeFileSync("site/index.html", page("What if the sky wasn't the limit?", `
  <a class="github" href="https://github.com/sky-src" target="_blank" >@sky-src</a>
  <a class="email" href="mailto:sky.src.sec@gmail.com" target="_blank" > @sky.src.sec</a>
  <h1 class="heading-main">What if 
  <a class="main-head"> the sky </a> wasn't the limit?</h1>
  <ul>${list}</ul>`));

if (fs.existsSync("style.css")) fs.copyFileSync("style.css", "site/style.css");