import fs from "fs";
import path from "path";
import axios from "axios";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import jwt from "jsonwebtoken";

const md = new MarkdownIt();

const GHOST_URL = process.env.GHOST_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

if (!GHOST_URL || !ADMIN_API_KEY) {
  console.error("❌ Missing Ghost API credentials!");
  process.exit(1);
}

// JWT token
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
const IGNORE_PATTERNS = [
  "readme",
  "changelog",
  "license",
  "migration",
  "history",
  "security",
  "contributing",
];

// Get files from command-line arguments
let files = process.argv.slice(2)
  .flatMap((f) => f.split(",")) // handle comma-separated lists
  .filter((f) => f.endsWith(".md"))  // only markdown
  .filter((f) => !IGNORE_PATTERNS.some((p) => f.toLowerCase().includes(p))); // ignore junk

if (!files.length) {
  console.log("📝 No markdown files to sync for this commit.");
  process.exit(0);
}

// --- Publish ---
async function publishToGhost() {
  console.log(`📝 Syncing ${files.length} markdown file(s)`);

  const token = makeToken();
  const api = axios.create({
    baseURL: `${GHOST_URL}/ghost/api/admin/`,
    headers: { Authorization: `Ghost ${token}` },
  });

  for (const file of files) {
    if (!fs.existsSync(file)) continue; // skip deleted files

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
