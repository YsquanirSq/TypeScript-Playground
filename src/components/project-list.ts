import { DragTarget } from "../model/drag-drop";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";
import { Project, ProjectStatus } from "../model/project";
import { Autobind } from "../decorators/autobind";
import { Component } from "./component";

export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	private listId: string;
	private assignedProjects: Project[];

	constructor(private type: ProjectStatus) {
		super(
			"project-list",
			"app",
			"beforeend",
			`${ProjectStatus[type].toString()}-projects`,
		);

		this.listId = "";
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	@Autobind()
	dragOverHandler(event: DragEvent): void {
		if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
			event.preventDefault();
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.add("droppable");
		}
	}
	@Autobind()
	dropHandler(event: DragEvent): void {
		const projectId = event.dataTransfer?.getData("text/plain");
		if (projectId) {
			projectState.moveProject(projectId, this.type);
		}
	}

	@Autobind()
	dragLeaveHandler(event: DragEvent): void {
		const listEl = this.element.querySelector("ul")!;
		listEl.classList.remove("droppable");
	}

	configure(): void {
		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects.filter((p) => {
				return p.status === this.type;
			});
			this.renderProjects();
		});

		this.element.addEventListener("dragover", this.dragOverHandler);
		this.element.addEventListener("dragleave", this.dragLeaveHandler);
		this.element.addEventListener("drop", this.dropHandler);
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
