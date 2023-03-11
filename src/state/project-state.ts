import { Project, ProjectStatus } from "../model/project.js";

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
			Math.random().toString(),
			title,
			description,
			numberOfPeople,
			ProjectStatus.active,
		);
		this.projects.push(newProject);
		this.notifyListeners();
	}

	public moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((project) => project.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.notifyListeners();
		}
	}

	private notifyListeners() {
		// Call all the listeners of the project state
		for (const listenerFunction of this.listeners) {
			listenerFunction(this.projects.slice());
		}
	}
}

export const projectState = ProjectState.getInstance();
