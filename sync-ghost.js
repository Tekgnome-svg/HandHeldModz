// sync-ghost.js
import fs from "fs";
import path from "path";
import axios from "axios";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// --- Configuration ---
const ghostURL = process.env.GHOST_ADMIN_API_URL; // Example: https://your-site.com
const ghostKey = process.env.GHOST_ADMIN_API_KEY; // Found in Ghost Admin -> Integrations

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
      posts: [
        {
          title,
          slug,
          html,
          status: "published",
          tags: data.tags || [],
          feature_image: data.feature_image || null,
          custom_excerpt: data.excerpt || null,
        },
      ],
    };

    try {
      const url = `${ghostURL}/ghost/api/admin/posts/?key=${ghostKey}`;
      await axios.post(url, post, { headers: { "Content-Type": "application/json" } });
      console.log(`✅ Published: ${title}`);
    } catch (err) {
      console.error(`❌ Failed to publish ${title}: ${err.response?.data || err.message}`);
    }
  }
}

publishToGhost();
