#!/usr/bin/env node

import { argv, exit } from "process";
import { useTaskServer } from "../dist/server.js";


function _runserver(modelsDirPath, tasksDir, loadModel) {
  const { app } = useTaskServer(
    tasksDir,
    [],
    {
      enableWs: false,
      modelsDirPath: modelsDirPath,
      loadModel: loadModel,
    },
    true,
  );
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
    if (argv.length < 4) {
      console.warn("Provide the models directory path and the tasks path as arguments")
      exit(1)
    }
    await main();
  } catch (e) {
    throw e
  }
})();



