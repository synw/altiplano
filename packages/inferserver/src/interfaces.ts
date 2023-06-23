import Router from 'koa-router';
import { useLlama } from "@altiplano/usellama";

interface InferServerParams {
  modelsDirPath?: string;
  loadModel?: string;
  enableWs?: boolean;
  router?: Router;
  lm?: ReturnType<typeof useLlama>;
  wsPort?: number;
  uiDir?: string;
}

interface LmRouterParams {
  lm?: ReturnType<typeof useLlama>;
  uiFile?: string;
  useModelsRoutes?: boolean;
  args?: Record<string, any>;
}

export { InferServerParams, LmRouterParams }