const GhostAdminAPI = require('@tryghost/admin-api');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// === CONFIG ===
const api = new GhostAdminAPI({
    url: 'https://handheldmodz.com',
    key: process.env.GHOST_ADMIN_API_KEY, // set as GitHub secret
    version: 'v5.0'
});

const BASE_FOLDER = path.join(__dirname, 'Guides');

// Map your folder names to exact Ghost tag strings
const tagMap = {
    'Asus': 'Asus ROG Ally Modifications',
    'Valve Steam Deck': 'Valve Steam Deck Modifications'
};

// Helper: generate safe slug
const slugify = str =>
    str.toLowerCase()
       .replace(/\s+/g, '-')        // spaces → hyphens
       .replace(/[^\w-]/g, '')      // remove special chars
       .replace(/-+/g, '-');        // remove repeated hyphens

// Recursively get all Markdown files
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

// Main sync function
async function sync() {
    const mdFiles = getMarkdownFiles(BASE_FOLDER);

    for (const filePath of mdFiles) {
        try {
            const markdown = fs.readFileSync(filePath, 'utf-8');
            const htmlContent = marked(markdown);

            // Extract handheld and guide name
            const parts = filePath.split(path.sep);
            const handheldName = parts[parts.indexOf('Guides') + 1];
            const guideName = path.basename(filePath, '.md');

            // Generate slug for the post URL
            const slug = slugify(guideName);

            // Map folder → tag
            const tag = tagMap[handheldName] || handheldName;
            const tags = [tag, 'Mods-Guides'];

            const postData = {
                title: guideName,
                html: htmlContent,
                status: 'published',
                slug,
                tags
            };

            console.log(`Syncing post: "${guideName}" with slug: "${slug}" and tags: ${tags.join(', ')}`);

            // Check if post exists
            const posts = await api.posts.browse({ filter: `slug:${slug}` });
            if (posts.length > 0) {
                await api.posts.edit({ id: posts[0].id, ...postData });
                console.log(`✅ Updated post: ${guideName}`);
            } else {
                await api.posts.add(postData);
                console.log(`✅ Created post: ${guideName}`);
            }

        } catch (err) {
            console.error(`❌ Error syncing file ${filePath}:`, err);
        }
    }
}

// Run the sync
sync();

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
