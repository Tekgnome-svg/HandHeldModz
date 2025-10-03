- name: Sync Markdown to Ghost
  env:
    GHOST_ADMIN_API_URL: ${{ secrets.GHOST_ADMIN_API_URL }}
    GHOST_ADMIN_API_KEY: ${{ secrets.GHOST_ADMIN_API_KEY }}
  run: node scripts/sync-ghost.js
