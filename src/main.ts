import { Plugin, WorkspaceLeaf } from 'obsidian';
import { InfiniteNotesView, VIEW_TYPE_INFINITE_NOTES } from './view';
import { InfiniteNotesSettings, DEFAULT_SETTINGS, InfiniteNotesSettingTab } from './settings';

export default class InfiniteNotesPlugin extends Plugin {
	settings: InfiniteNotesSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_INFINITE_NOTES,
			(leaf) => new InfiniteNotesView(leaf, this.settings)
		);

		this.addRibbonIcon('infinity', 'Infinite notes', () => {
			void this.activateView();
		});

		this.addCommand({
			id: 'open-feed', // Removed plugin-id prefix
			name: 'Open feed', // Sentence case and removed plugin name
			callback: () => {
				void this.activateView();
			}
		});

		this.addSettingTab(new InfiniteNotesSettingTab(this.app, this));

		this.registerObsidianProtocolHandler("open-infinite-notes", () => {
			void this.activateView();
		});
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_INFINITE_NOTES);

		if (leaves.length > 0) {
			leaf = leaves[0]!;
		} else {
			leaf = workspace.getLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_INFINITE_NOTES, active: true });
		}

		if (leaf) {
			await workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as InfiniteNotesSettings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {

	}
}
