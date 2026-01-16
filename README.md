# Infinite Notes

**Infinite Notes** is an Obsidian plugin that transforms your note-taking experience by displaying a random feed of your notes, inspired by the "Reels" or "TikTok" scrolling style. Rediscover your old ideas, snippets, and memories in an engaging, infinite stream.

## Features

-   **Infinite Scroll**: Scroll vertically to see a continuous, randomly generated feed of your notes.
-   **Random Selection**: Notes are pulled randomly from your entire vault, helping you resurface forgotten content.
-   **Immersive View**: Uses full-height cards with snap scrolling for a focus-friendly experience.
-   **Ignore Folders**: Exclude specific folders (e.g., templates, archives) from the feed via the Settings page.
-   **Mobile Friendly**: Designed to work seamlessly on both desktop and mobile.

## How to Use

1.  **Open the Feed**:
    -   Click the **Infinity Icon** in the ribbon (left sidebar).
    -   Use the Command Palette (`Cmd/Ctrl + P`) and search for **"Infinite Notes: Open Infinite Notes Feed"**.
    -   Use the URI Scheme: `obsidian://open-infinite-notes`

2.  **Configure Settings**:
    -   Go to **Settings > Infinite Notes**.
    -   Add folders you want to exclude from the feed (e.g., "Templates", "Daily Notes").

## Installation

### From Community Plugins (Coming Soon)
1.  Open **Settings** > **Community Plugins**.
2.  Turn off **Safe Mode**.
3.  Click **Browse** and search for **"Infinite Notes"**.
4.  Click **Install** and then **Enable**.

### Manual Installation
1.  Download the latest release from the [Releases](https://github.com/Tixamala/infinite-notes/releases) page.
2.  Extract the `main.js`, `manifest.json`, and `styles.css` files.
3.  Place them in your vault's plugin folder: `<VaultFolder>/.obsidian/plugins/infinite-notes/`.
4.  Reload Obsidian and enable the plugin.

## URI Scheme

You can open the Infinite Notes feed directly from external applications or other notes using the Obsidian URI scheme:

```
obsidian://open-infinite-notes
```

## Development

1.  Clone this repository.
2.  Run `npm install`.
3.  Run `npm run build` to compile.
