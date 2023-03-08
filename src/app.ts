class ProjectInput {
	public template: HTMLTemplateElement;
	public hostElement: HTMLElement;
	constructor() {
		this.template = document.getElementById(
			"project-input",
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(this.template.content, true);
		this.attach(importedNode.firstElementChild as HTMLFormElement);
	}

	private attach(element: HTMLFormElement | null) {
		if (element) {
			this.hostElement.insertAdjacentElement("afterbegin", element);
		}
	}
}

const projectInput = new ProjectInput();
