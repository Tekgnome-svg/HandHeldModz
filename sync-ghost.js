const GhostAdminAPI = require('@tryghost/admin-api');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const api = new GhostAdminAPI({
    url: 'https://handheldmodz.com',
    key: process.env.GHOST_ADMIN_API_KEY, // use GitHub secret
    version: 'v5.0'
});

// Base folder containing Markdown guides
const BASE_FOLDER = path.join(__dirname, 'Guides');

// Helper: generate slug from folder/handheld name
const slugify = str => str.toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]/g, '');

// Recursively read Markdown files
function getMarkdownFiles(dir) {
    let files = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getMarkdownFiles(fullPath));
        } else if (entry.name.endsWith('.md')) {
            files.push(fullPath);
        }
    });
    return files;
}

// Main sync
async function sync() {
    const mdFiles = getMarkdownFiles(BASE_FOLDER);

    for (const filePath of mdFiles) {
        const markdown = fs.readFileSync(filePath, 'utf-8');
        const htmlContent = marked(markdown);

        // Extract handheld and guide name
        const parts = filePath.split(path.sep);
        const handheldName = parts[parts.indexOf('Guides') + 1];
        const guideName = path.basename(filePath, '.md');

        const slug = slugify(`${handheldName}-modifications`);
        const tags = [handheldName.toLowerCase() + " modifications", "mods-guides"];

        const postData = {
            title: guideName,
            html: htmlContent,
            status: 'published',
            slug,
            tags
        };

        try {
            // Check if post exists
            const posts = await api.posts.browse({ filter: `slug:${slug}` });
            if (posts.length > 0) {
                await api.posts.edit({ id: posts[0].id, ...postData });
                console.log(`Updated post: ${guideName}`);
            } else {
                await api.posts.add(postData);
                console.log(`Created post: ${guideName}`);
            }
        } catch (err) {
            console.error(`Error syncing ${guideName}:`, err);
        }
    }
}

sync();
