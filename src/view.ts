
import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";
import { InfiniteNotesSettings } from "./settings";

export const VIEW_TYPE_INFINITE_NOTES = "infinite-notes-view";

export class InfiniteNotesView extends ItemView {
	settings: InfiniteNotesSettings;
	private isLoading = false; // Protection against parallel downloads
										 // to prevent too many notes from being downloaded at once

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

	getIcon(): string {
        return "infinity";
    }

	async onOpen() {
			const container = this.containerEl.children[1];
			if (!container) return;

			container.empty();
			container.addClass("infinite-notes-container");

			// Initial load
			for (let i = 0; i < 5; i++) {
				await this.appendRandomNote(container);
			}

			// Optimized scroll handler
			container.addEventListener("scroll", () => {
				if (this.isLoading) return;

				const { scrollTop, clientHeight, scrollHeight } = container;
				const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

				if (distanceFromBottom <= 100) {
					this.isLoading = true;
					void this.appendRandomNote(container).finally(() => {
						this.isLoading = false;
					});
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

		// Header
		const header = noteCard.createDiv({ cls: "infinite-note-header" });

		// file name (clickable)
		const title = header.createEl("h2", { text: randomFile.basename });
		title.addClass("infinite-note-title");
		title.addClass("clickable-title");
		title.setAttribute("aria-label", "Open note");  // tooltip

		// click handler
		title.addEventListener("click", (e) => {
		    e.stopPropagation();  // off scroll
		    const file = this.app.vault.getAbstractFileByPath(randomFile.path);
		    if (file) {
		    	// can set this to getLeaf(false) so that the note opens in the same tab,
		    	// then you can return to the feed by pressing the "back" button,
		    	// but in this case the feed will be overwritten
		        this.app.workspace.getLeaf(false).openFile(file);  // open in new tab

		        // this commented code will allow you to open a note in the current tab,
		        // this can be useful to navigate back to the feed using the back button,
		        // but in this case the feed will reload
		        // const activeLeaf = this.app.workspace.getMostRecentLeaf();
				// if (activeLeaf) {
				//	  void activeLeaf.openFile(file);
				// }
		    } else {
		    	new Notice(`Could not open "${randomFile.basename}"`, 4000);
		    }
		});

        // Content
        const contentEl = noteCard.createDiv({ cls: "infinite-note-content markdown-preview-view markdown-rendered" });

		await MarkdownRenderer.render(
			this.app,
			content,
			contentEl,
			randomFile.path,
			this
		);
	}
}
