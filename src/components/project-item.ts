import { Draggable } from "../model/drag-drop";
import { Project } from "../model/project";
import { Autobind } from "../decorators/autobind";
import { Component } from "./component";

export class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;
	constructor(hostElementId: string, project: Project) {
		super("single-project", hostElementId, "beforeend", project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}
	@Autobind()
	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData("text/plain", this.project.id);
		event.dataTransfer!.effectAllowed = "move";
	}
	dragEndHandler(event: DragEvent): void {
		return; //not implemented
	}

	configure(): void {
		this.element.addEventListener("dragstart", this.dragStartHandler);
		this.element.addEventListener("dragend", this.dragEndHandler);
	}
	renderContent(): void {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent =
			this.project.peopleInProjectAsString;
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}
