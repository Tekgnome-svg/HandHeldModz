// sync-ghost.js
import fs from "fs";
import path from "path";
import axios from "axios";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// --- Configuration ---
const ghostURL = process.env.GHOST_ADMIN_API_URL; // e.g. https://handheldmodz.com
const ghostKey = process.env.GHOST_ADMIN_API_KEY; // From Ghost Admin → Integrations

if (!ghostURL || !ghostKey) {
  console.error("❌ Missing Ghost API credentials!");
  process.exit(1);
}

// --- Helpers ---
function getMarkdownFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath));
    } else if (file.endsWith(".md")) {
      files.push(fullPath);
    }
  });
  return files;
}

// --- Main ---
async function publishToGhost() {
  const markdownFiles = getMarkdownFiles("./");
  console.log(`📝 Found ${markdownFiles.length} markdown files`);

  for (const file of markdownFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const html = md.render(content);

    const title = data.title || path.basename(file, ".md");
    const slug = data.slug || title.toLowerCase().replace(/\s+/g, "-");

    const post = {
      title,
      slug,
      html,
      status: "published",
      tags: data.tags || [],
      feature_image: data.feature_image || null,
      custom_excerpt: data.excerpt || null,
    };

    const apiUrl = `${ghostURL}/ghost/api/admin/posts/?source=html&key=${ghostKey}`;

    try {
      const res = await axios.post(apiUrl, { posts: [post] }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(`✅ Published: ${title}`);
    } catch (err) {
      // Print the full Ghost API response for easier debugging
      const msg = err.response?.data?.errors?.[0]
        ? `${err.response.data.errors[0].message} (${err.response.data.errors[0].context || "no context"})`
        : err.message;
      console.error(`❌ Failed to publish "${title}": ${msg}`);
    }
  }
}

publishToGhost();
