import Router from 'koa-router';
import { useInferServer, useLmRouter } from "@altiplano/inferserver";
import type { InferServerParams } from "@altiplano/inferserver";
import { initTasksDir, setModelsDir, setVerbosity } from './state.js';
import { useTaskRouter } from './router.js';

const useTaskServer = (
  tasksDirectory: string,
  routes?: Array<(r: Router) => void>,
  params: InferServerParams = {},
  verbose = false,
) => {
  setVerbosity(verbose);
  initTasksDir(tasksDirectory);
  let _routes = [useTaskRouter];
  if (routes) {
    _routes = [useTaskRouter, ...routes]
  }
  params.router = useLmRouter(_routes);
  if (!("modelsDirPath" in params)) {
    throw new Error("Provide a models directory path argument")
  }
  setModelsDir(params.modelsDirPath ?? "");
  const { app, lm } = useInferServer(params);

  return {
    app,
    lm,
  }
}

export { useTaskServer }