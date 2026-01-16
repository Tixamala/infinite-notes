
import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";
import { InfiniteNotesSettings } from "./settings";

export const VIEW_TYPE_INFINITE_NOTES = "infinite-notes-view";

export class InfiniteNotesView extends ItemView {
	settings: InfiniteNotesSettings;

	constructor(leaf: WorkspaceLeaf, settings: InfiniteNotesSettings) {
		super(leaf);
		this.settings = settings;
	}

	getViewType() {
		return VIEW_TYPE_INFINITE_NOTES;
	}

	getDisplayText() {
		return "Infinite notes";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		if (!container) return;
		
		container.empty();
		container.addClass("infinite-notes-container");

		// Initial load of a few notes
		for (let i = 0; i < 5; i++) {
			await this.appendRandomNote(container);
		}

		// Infinite scroll observer (simple implementation)
		container.addEventListener("scroll", () => {
			if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
				void this.appendRandomNote(container);
			}
		});
	}

	async onClose() {
		// Nothing to clean up for now
	}

	async appendRandomNote(container: Element) {
		let files = this.app.vault.getMarkdownFiles();
		
		// Filter ignored folders
		if (this.settings.ignoredFolders.length > 0) {
			files = files.filter(file => {
				return !this.settings.ignoredFolders.some(folder => file.path.startsWith(folder));
			});
		}

		if (files.length === 0) return;

		const randomFile = files[Math.floor(Math.random() * files.length)];
		if (!randomFile) return;

		const content = await this.app.vault.read(randomFile);

		const noteCard = container.createDiv({ cls: "infinite-note-card" });
		
        // Header with file name
        const header = noteCard.createEl("h2", { text: randomFile.basename });
        header.addClass("infinite-note-header");

        // Content
		const contentEl = noteCard.createDiv({ cls: "infinite-note-content" });

		await MarkdownRenderer.render(
			this.app,
			content,
			contentEl,
			randomFile.path,
			this
		);
	}
}
