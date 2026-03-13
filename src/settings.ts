
import { App, PluginSettingTab, Setting, TFolder, FuzzySuggestModal } from "obsidian";
import InfiniteNotesPlugin from "./main";

export interface InfiniteNotesSettings {
	ignoredFolders: string[];
	loadThreshold: number;
}

export const DEFAULT_SETTINGS: InfiniteNotesSettings = {
	ignoredFolders: [],
	loadThreshold: 100,
};

export class InfiniteNotesSettingTab extends PluginSettingTab {
	plugin: InfiniteNotesPlugin;

	constructor(app: App, plugin: InfiniteNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();



		new Setting(containerEl)
			.setName("Ignored folders")
			.setDesc("Notes in these folders will not appear in the feed.")
			.addButton((button) =>
				button
					.setButtonText("Add folder")
					.setCta()
					.onClick(() => {
						new FolderSuggestModal(this.app, (folder) => {
							if (!this.plugin.settings.ignoredFolders.includes(folder.path)) {
								this.plugin.settings.ignoredFolders.push(folder.path);
								void this.plugin.saveSettings();
								this.display(); // Refresh to show new folder
							}
						}).open();
					})
			);

		if (this.plugin.settings.ignoredFolders.length === 0) {
			containerEl.createDiv({ text: "No folders ignored.", cls: "setting-item-description" });
		} else {
			this.plugin.settings.ignoredFolders.forEach((path) => {
				new Setting(containerEl)
					.setName(path)
					.addButton((button) =>
						button
							.setIcon("trash")
							.setTooltip("Remove")
							.onClick(async () => {
								this.plugin.settings.ignoredFolders = this.plugin.settings.ignoredFolders.filter(
									(p) => p !== path
								);
								await this.plugin.saveSettings();
								this.display();
							})
					);
			});
		}

		// Threshold setting
		new Setting(containerEl)
			.setName("Load threshold")
			.setDesc("Distance from bottom (px) to trigger loading next note. May be useful on a mobile device")
			.addSlider((slider) =>
				slider
					.setLimits(100, 1000, 50) // TODO: should be moved to a separate config
					.setValue(this.plugin.settings.loadThreshold)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.loadThreshold = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

export class FolderSuggestModal extends FuzzySuggestModal<TFolder> {
	onChoose: (folder: TFolder) => void;

	constructor(app: App, onChoose: (folder: TFolder) => void) {
		super(app);
		this.onChoose = onChoose;
	}

	getItems(): TFolder[] {
		const files = this.app.vault.getAllLoadedFiles();
		return files.filter((f): f is TFolder => f instanceof TFolder);
	}

	getItemText(item: TFolder): string {
		return item.path;
	}

	onChooseItem(item: TFolder, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(item);
	}
}
