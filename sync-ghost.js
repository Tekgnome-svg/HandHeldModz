// sync-ghost.js
import fs from "fs";
import path from "path";
import axios from "axios";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import jwt from "jsonwebtoken";

const md = new MarkdownIt();

// --- Configuration ---
const GHOST_URL = process.env.GHOST_ADMIN_API_URL; // e.g. https://handheldmodz.com
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY; // From Ghost → Integrations

if (!GHOST_URL || !ADMIN_API_KEY) {
  console.error("❌ Missing Ghost API credentials!");
  process.exit(1);
}

// --- Create a JWT token for authentication ---
function makeToken() {
  const [id, secret] = ADMIN_API_KEY.split(":");
  return jwt.sign({}, Buffer.from(secret, "hex"), {
    keyid: id,
    algorithm: "HS256",
    expiresIn: "5m",
    audience: "/admin/",
  });
}

// --- Helpers ---
function getMarkdownFiles(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath));
    } else if (file.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

// --- Main sync function ---
async function publishToGhost() {
  const files = getMarkdownFiles("./");
  console.log(`📝 Found ${files.length} markdown files`);

  const token = makeToken();
  const api = axios.create({
    baseURL: `${GHOST_URL}/ghost/api/admin/`,
    headers: { Authorization: `Ghost ${token}` },
  });

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const html = md.render(content);

    const title = data.title || path.basename(file, ".md");
    const slug = (data.slug || title.toLowerCase().replace(/\s+/g, "-")).replace(/[^a-z0-9\-]/g, "");

    const post = {
      title,
      slug,
      html,
      status: "published",
      tags: data.tags || [],
      feature_image: data.feature_image || null,
      custom_excerpt: data.excerpt || null,
    };

    try {
      await api.post("posts/?source=html", { posts: [post] });
      console.log(`✅ Published: ${title}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.message;
      console.error(`❌ Failed to publish "${title}": ${msg}`);
    }
  }
}

publishToGhost();
