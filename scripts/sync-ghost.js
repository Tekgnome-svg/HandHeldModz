// scripts/sync-ghost.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const fetch = require("node-fetch");

const ghostUrl = process.env.GHOST_ADMIN_API_URL.replace(/\/$/, "");
const ghostKey = process.env.GHOST_ADMIN_API_KEY;

function getAllMarkdownFiles(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    } else if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    }
  });
  return files;
}

function generateSlug(filePath) {
  let relative = path.relative("Guides", filePath).replace(/\.md$/i, "");
  relative = relative.replace(/\\/g, "/");
  let lastPart = relative.split("/").pop();
  return lastPart
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateTags(filePath) {
  const relative = path.relative("Guides", filePath).replace(/\\/g, "/");
  const folders = relative.split("/").slice(0, -1);
  return folders.map(f => f.trim()).filter(Boolean);
}

async function upsertPost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    console.error(`Missing title in ${filePath}, skipping`);
    return;
  }

  const slug = data.slug ? data.slug : generateSlug(filePath);
  const tags = data.tags && data.tags.length > 0 ? data.tags : generateTags(filePath);

  const slugUrl = `${ghostUrl}/ghost/api/admin/posts/slug/${slug}/`;
  const existingRes = await fetch(slugUrl, {
    headers: { Authorization: `Ghost ${ghostKey}` }
  });
  let existing = null;
  if (existingRes.ok) existing = await existingRes.json();

  const postPayload = {
    title: data.title,
    slug: slug,
    html: content,
    status: data.status || "draft",
    tags: tags
  };

  if (existing && existing.posts && existing.posts.length > 0) {
    const id = existing.posts[0].id;
    await fetch(`${ghostUrl}/ghost/api/admin/posts/${id}/`, {
      method: "PUT",
      headers: {
        "Authorization": `Ghost ${ghostKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ posts: [postPayload] })
    });
    console.log(`Updated post: ${data.title}`);
  } else {
    await fetch(`${ghostUrl}/ghost/api/admin/posts/`, {
      method: "POST",
      headers: {
        "Authorization": `Ghost ${ghostKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ posts: [postPayload] })
    });
    console.log(`Created new post: ${data.title}`);
  }
}

const allMdFiles = getAllMarkdownFiles("Guides");
allMdFiles.forEach(f => upsertPost(f));
