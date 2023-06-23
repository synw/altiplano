#!/usr/bin/env node

import { argv, exit } from "process";
import { useTaskServer } from "../server.js";

/**
 * A function to start the server with a specified model or all models in the directory.
 * @param modelsDirPath - Path of the directory containing the models.
 * @param tasksDir - Path of the directory containing the tasks.
 * @param modelName - Optional name of the model to use
 */
function _runserver(modelsDirPath: string, tasksDir: string, loadModel?: string) {
  const { app } = useTaskServer(
    tasksDir,
    [],
    {
      enableWs: false,
      modelsDirPath: modelsDirPath,
      loadModel: loadModel,
    });
  app.listen(5143, () => {
    console.log("Tasks server running on port 5143");
  });
}

async function main() {
  let modelsDir = "";
  let modelLoad = "";
  let tasksDir = "";
  if (argv.length > 2) {
    let i = 0;
    for (const arg of argv.slice(2, argv.length)) {
      if (i == 0) {
        modelsDir = arg;
      } else if (i == 1) {
        tasksDir = arg;
      } else {
        modelLoad = arg;
      }
      ++i
    }
  }
  _runserver(modelsDir, tasksDir, modelLoad);
}

(async () => {
  try {
    if (argv.length < 3) {
      console.warn("Provide a models directory path as argument")
      exit(1)
    }
    await main();
  } catch (e) {
    throw e
  }
})();



