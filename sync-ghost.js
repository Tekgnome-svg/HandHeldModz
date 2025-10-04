// sync-ghost.js
import fs from "fs";
import path from "path";
import axios from "axios";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import jwt from "jsonwebtoken";

const md = new MarkdownIt();

// --- Ghost configuration ---
const GHOST_URL = process.env.GHOST_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

if (!GHOST_URL || !ADMIN_API_KEY) {
  console.error("❌ Missing Ghost API credentials!");
  process.exit(1);
}

// --- JWT for Ghost Admin API ---
function makeToken() {
  const [id, secret] = ADMIN_API_KEY.split(":");
  return jwt.sign({}, Buffer.from(secret, "hex"), {
    keyid: id,
    algorithm: "HS256",
    expiresIn: "5m",
    audience: "/admin/",
  });
}

// --- Get files from command-line arguments ---
const files = process.argv.slice(2);

if (!files.length) {
  console.log("📝 No markdown files to sync for this commit.");
  process.exit(0);
}

console.log(`📝 Found ${files.length} markdown files to sync.`);

// --- Ghost API client ---
const token = makeToken();
const api = axios.create({
  baseURL: `${GHOST_URL}/ghost/api/admin/`,
  headers: { Authorization: `Ghost ${token}` },
});

// --- Main publish function ---
async function publishToGhost() {
  for (const file of files) {
    // Skip if file doesn't exist
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ File not found: ${file}`);
      continue;
    }

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
