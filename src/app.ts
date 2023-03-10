enum ProjectStatus {
	active,
	finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		protected numberOfPeople: number,
		public status: ProjectStatus,
	) {}

	get peopleInProjectAsString() {
		if (this.numberOfPeople === 0) {
			return "No people assigned.";
		}
		if (this.numberOfPeople === 1) {
			return "One person assigned.";
		} else {
			return `${this.numberOfPeople.toString()} persons assigned`;
		}
	}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];
	public addListener(listenerFunction: Listener<T>) {
		this.listeners.push(listenerFunction);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new ProjectState();
		}
		return this.instance;
	}

	public addProject(
		title: string,
		description: string,
		numberOfPeople: number,
	) {
		const newProject = new Project(
			Math.random.toString(),
			title,
			description,
			numberOfPeople,
			ProjectStatus.active,
		);
		this.projects.push(newProject);
		this.notifyListeners();
	}

	private notifyListeners() {
		// Call all the listeners of the project state
		for (const listenerFunction of this.listeners) {
			listenerFunction(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	public templateElement: HTMLTemplateElement;
	public hostElement: T;
	public element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertPosition: InsertPosition,
		newElementId?: string,
	) {
		this.templateElement = document.getElementById(
			templateId,
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId)! as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true,
		);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach(insertPosition);
	}

	private attach(insertPosition: InsertPosition) {
		this.hostElement.insertAdjacentElement(insertPosition, this.element);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
	private project: Project;
	constructor(hostElementId: string, project: Project) {
		super("single-project", hostElementId, "beforeend", project.id);
		this.project = project;

		this.renderContent();
	}

	configure(): void {
		throw new Error("Method not implemented.");
	}
	renderContent(): void {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent =
			this.project.peopleInProjectAsString;
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
	private listId: string;
	private assignedProjects: Project[];

	constructor(private type: ProjectStatus) {
		super(
			"project-list",
			"app",
			"beforeend",
			`${ProjectStatus[type].toString()}-project-list`,
		);

		this.listId = "";
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	configure(): void {
		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects.filter((p) => {
				return p.status === this.type;
			});
			this.renderProjects();
		});
	}

	renderContent() {
		this.listId = `${this.type}-project-list`;
		this.element.querySelector("ul")!.id = this.listId;
		this.element.querySelector("h2")!.textContent = `${ProjectStatus[
			this.type
		].toUpperCase()} PROJECTS`;
	}

	private renderProjects() {
		const listElement = document.getElementById(
			this.listId,
		)! as HTMLUListElement;
		listElement.innerHTML = "";
		for (const project of this.assignedProjects) {
			new ProjectItem(this.element.querySelector("ul")!.id, project);
		}
	}
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
		event.preventDefault();
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
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
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.active);
const finishedProjectList = new ProjectList(ProjectStatus.finished);
