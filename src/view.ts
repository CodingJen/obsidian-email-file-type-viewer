import { Menu, MenuItem, sanitizeHTMLToDom, TextFileView } from "obsidian";
import PostalMime from "postal-mime";

export const VIEW_TYPE_EMAIL = "email-view";

export class EmailView extends TextFileView {
	headerView: HTMLElement;
	bodyView: HTMLElement;
	htmlFrame: HTMLElement;
	viewMenu: Menu;
	blahMenuItem: MenuItem;

	getViewData() {
		return this.data;
	}

	// if clear is set then were opening a completely different file
	async setViewData(data: string, clear: boolean) {
		this.data = data;

		this.contentEl.empty();

		const parser = new PostalMime();
		const parsedMail = await parser.parse(this.data);

		//const messageText = parsedMail.text?.split("\n");
		const sanitizedMessage = sanitizeHTMLToDom(parsedMail.html as string);

		//messageText?.forEach((line) => this.bodyView.createDiv({ text: line }));

		this.contentEl.appendChild(sanitizedMessage);
	}

	async onOpen() {
		this.headerView = this.contentEl.createDiv({ cls: "header-content" });
		this.bodyView = this.contentEl.createDiv({ cls: "body-data" });
		this.htmlFrame = this.contentEl.createEl("iframe", {
			cls: "myIframe",
		});
	}

	async onClose() {
		this.contentEl.empty();
	}

	clear() {
		this.data = "";
	}

	getViewType() {
		return VIEW_TYPE_EMAIL;
	}
}
