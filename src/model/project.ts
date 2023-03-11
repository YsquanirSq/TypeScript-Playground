export enum ProjectStatus {
	active,
	finished,
}

export class Project {
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
