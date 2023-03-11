import { projectState } from "../state/project-state.js";
import * as Validation from "../util/validation.js";
import { Autobind } from "../decorators/autobind.js";
import { Component } from "./component.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	public titleInputElement: HTMLInputElement;
	public descriptionInputElement: HTMLInputElement;
	public peopleInputElement: HTMLInputElement;

	constructor() {
		super("project-input", "app", "afterbegin", "user-input");

		this.titleInputElement = this.element.querySelector("#title")!;
		this.descriptionInputElement = this.element.querySelector("#description")!;
		this.peopleInputElement = this.element.querySelector("#people")!;

		this.configure();
	}

	@Autobind()
	configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	renderContent(): void {
		throw new Error("Method not implemented.");
	}

	private gatherUserInput(): [string, string, number] | void {
		const titleInput = this.titleInputElement.value;
		const descriptionInput = this.descriptionInputElement.value;
		const peopleInput = this.peopleInputElement.value;

		const titleValidator: Validation.Validatable = {
			value: titleInput,
			required: true,
		};

		const descriptionValidator: Validation.Validatable = {
			value: descriptionInput,
			required: true,
			minLength: 20,
			maxLength: 200,
		};

		const peopleValidator: Validation.Validatable = {
			value: +peopleInput,
			required: true,
			min: 1,
			max: 100,
		};

		if (
			!(
				Validation.validate(titleValidator) &&
				Validation.validate(descriptionValidator) &&
				Validation.validate(peopleValidator)
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
		event.preventDefault();
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
		}
		this.clearInputs();
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.peopleInputElement.value = "";
	}
}
