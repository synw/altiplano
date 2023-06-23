import path from "path";

const execPath = process.cwd();

let tasksDir = "";
let verbose = false;
let modelsDir: string = "";

function initTasksDir(t: string) {
  let _t = t;
  if (!t.startsWith("/")) {
    _t = path.join(execPath, t);
  }
  tasksDir = _t;
}

function setVerbosity(v: boolean) {
  verbose = v;
}

function setModelsDir(v: string) {
  modelsDir = v;
}

export { execPath, tasksDir, verbose, modelsDir, initTasksDir, setVerbosity, setModelsDir }