import { ProjectList } from "./components/project-list";
import { ProjectInput } from "./components/project-input";
import { ProjectStatus } from "./model/project";

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.active);
const finishedProjectList = new ProjectList(ProjectStatus.finished);

console.log("hi");
