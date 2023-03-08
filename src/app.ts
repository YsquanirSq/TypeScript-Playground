// Autobind Decorator
function AutobindFactory() {
	return function autobind(
		target: object,
		methodName: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;
		const adjustedDescriptor: PropertyDescriptor = {
			configurable: true,
			get() {
				const boundFunction = originalMethod.bind(this);
				return boundFunction;
			},
		};
		return adjustedDescriptor;
	};
}

class ProjectInput {
	public template: HTMLTemplateElement;
	public hostElement: HTMLElement;
	public mainFormElement: HTMLElement;

	public titleInputElement: HTMLInputElement;
	public descriptionInputElement: HTMLInputElement;
	public peopleInputElement: HTMLInputElement;

	constructor() {
		this.template = document.getElementById(
			"project-input",
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(this.template.content, true);
		this.mainFormElement = importedNode.firstElementChild as HTMLFormElement;

		this.titleInputElement = this.mainFormElement.querySelector("#title")!;
		this.descriptionInputElement =
			this.mainFormElement.querySelector("#description")!;
		this.peopleInputElement = this.mainFormElement.querySelector("#people")!;

		this.configure();
		this.attach();
	}

	@AutobindFactory()
	private configure() {
		this.mainFormElement.addEventListener("submit", this.submitHandler);
	}

	private submitHandler(event: Event) {
		event?.preventDefault;
		console.log("Handling a received 'submit' handler.");
	}

	private attach() {
		if (this.mainFormElement) {
			this.hostElement.insertAdjacentElement(
				"afterbegin",
				this.mainFormElement,
			);
		}
	}
}

const projectInput = new ProjectInput();
