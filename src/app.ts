interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && !!validatableInput.value;
	}
	// String validations
	if (
		validatableInput.minLength &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.toString().trim().length >
				validatableInput.minLength;
	}
	if (
		validatableInput.maxLength &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.toString().trim().length <
				validatableInput.maxLength;
	}
	// Numerical validations
	if (validatableInput.min && typeof validatableInput.value === "number") {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}
	if (validatableInput.max && typeof validatableInput.value === "number") {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}
	return isValid;
}

// Autobind Decorator
function Autobind() {
	return function autobind(
		_target: object,
		_methodName: string,
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

class ProjectList {
	public templateElement: HTMLTemplateElement;
	public hostElement: HTMLDivElement;
	public element: HTMLElement;

	constructor(private type: "active" | "finished") {
		this.templateElement = document.getElementById(
			"project-list",
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(
			this.templateElement.content,
			true,
		);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;
		this.attach();
		this.renderContent();
	}

	private attach() {
		this.hostElement.insertAdjacentElement("beforeend", this.element);
	}

	private renderContent() {
		const listId = `${this.type}-project-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector(
			"h2",
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}
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

	@Autobind()
	private configure() {
		this.mainFormElement.addEventListener("submit", this.submitHandler);
	}

	private gatherUserInput(): [string, string, number] | void {
		const titleInput = this.titleInputElement.value;
		const descriptionInput = this.descriptionInputElement.value;
		const peopleInput = this.peopleInputElement.value;

		const titleValidator: Validatable = {
			value: titleInput,
			required: true,
		};

		const descriptionValidator: Validatable = {
			value: descriptionInput,
			required: true,
			minLength: 20,
			maxLength: 200,
		};

		const peopleValidator: Validatable = {
			value: +peopleInput,
			required: true,
			min: 1,
			max: 100,
		};

		if (
			!(
				validate(titleValidator) &&
				validate(descriptionValidator) &&
				validate(peopleValidator)
			)
		) {
			alert("Invalid input, please try again!");
			return;
		} else {
			return [titleInput, descriptionInput, +peopleInput];
		}
	}

	@Autobind()
	private submitHandler(event: Event) {
		event?.preventDefault;
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			console.log(title, description, people);
		}
		this.clearInputs();
		console.log("Handling a received 'submit' handler.");
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.peopleInputElement.value = "";
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
