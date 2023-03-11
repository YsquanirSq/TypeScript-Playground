import { ProjectList } from "./components/project-list.js";
import { ProjectInput } from "./components/project-input.js";
import { ProjectStatus } from "./model/project.js";

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.active);
const finishedProjectList = new ProjectList(ProjectStatus.finished);
