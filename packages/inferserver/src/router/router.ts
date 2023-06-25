import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import { dirpath } from '../state.js';
import { useModelRouter } from './model/model_router.js';
import { useInferRouter } from './infer/infer_router.js';
import { LmRouterParams } from '../interfaces.js';

const useLmRouter = (
  routes: Array<(r: Router) => void> = [],
  params: LmRouterParams = {
    useModelsRoutes: true,
    useInferRoutes: true,
  }
) => {
  const router = new Router();

  const _routes = routes;
  if (params.useModelsRoutes) {
    _routes.push(useModelRouter)
  }
  if (params.useInferRoutes) {
    _routes.push(useInferRouter)
  }
  _routes.forEach((f) => f(router));

  router.all('(.*)', async (ctx) => {
    ctx.status = 404;
    if (params.uiFile) {
      let filePath = params.uiFile;
      if (!params.uiFile.startsWith("/")) {
        filePath = path.join(dirpath, params.uiFile)
      }
      ctx.body = await fs.promises.readFile(filePath, 'utf8');
    }
  });

  return router
}

export { useLmRouter }