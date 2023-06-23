
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import cors from '@koa/cors';
import { useLlama } from '@altiplano/usellama';
import { useLmRouter } from "./router/router.js";
import { setReady, dirpath, initLm, setWsMode, initWebsockets, enableWs } from './state.js';
import { InferServerParams } from './interfaces.js';
import { readModelsDir } from "./cmds/read_models.js";
import { initModels } from "./state.js";

const useInferServer = (
  params: InferServerParams = { enableWs: true }): { app: Koa, lm: ReturnType<typeof useLlama> } => {
  setWsMode(params.enableWs ?? true);
  console.log("Ws:", enableWs);
  initWebsockets(enableWs, params.wsPort ?? 5142);

  let _router = params.router;
  if (!_router) {
    if (params.uiDir) {
      _router = useLmRouter([], {
        uiFile: path.join(params.uiDir, "index.html")
      });
    } else {
      _router = useLmRouter()
    }
  }

  const lm = initLm(params.lm);
  if (params.modelsDirPath) {
    const modelsNames = readModelsDir(params.modelsDirPath);
    initModels(modelsNames, params.modelsDirPath);
    if (params.loadModel) {
      lm.loadModel(path.join(params.modelsDirPath, params.loadModel));
    }
  }

  const app = new Koa();
  app.use(cors({ credentials: true }));
  if (params.uiDir) {
    app.use(serve(path.join(dirpath, './ui')));
  }
  app.use(_router.routes()).use(_router.allowedMethods());

  setReady(true);

  return { app: app, lm: lm }
}

export { useInferServer }
