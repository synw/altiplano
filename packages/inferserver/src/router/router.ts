import Router from 'koa-router';
import { koaBody } from "koa-body";
import fs from 'fs';
import path from 'path';
import { onReady, lm, dirpath } from '../state.js';
import { useModelRouter } from './model/model_router.js';
import { OptionalInferenceParams } from '@altiplano/types';
import { LmRouterParams } from '../interfaces.js';

const useLmRouter = (
  routes: Array<(r: Router) => void> = [],
  params: LmRouterParams = {
    useModelsRoutes: true
  }
) => {
  const router = new Router();

  router.post('/infer', koaBody(), async (ctx) => {
    await onReady;
    const body = ctx.request.body;
    const params = body["params"];
    if (params) {
      lm.params(params as OptionalInferenceParams)
    }
    const tvars = body["tvars"] ?? [];
    const res = await lm.infer(body["prompt"], body["template"], tvars);
    if (res.completed) {
      ctx.type = 'application/json';
      ctx.body = res;
      ctx.status = 200;
    } else {
      ctx.status = 202;
    }
  });

  router.get('/abort', async (ctx) => {
    await onReady;
    lm.abort();
    ctx.status = 204;
  });

  const _routes = routes;
  if (params.useModelsRoutes) {
    _routes.push(useModelRouter)
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