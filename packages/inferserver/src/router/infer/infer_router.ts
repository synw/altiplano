import Router from "koa-router"
import { koaBody } from "koa-body";
import { OptionalInferenceParams } from '@altiplano/types';
import { lm, onReady } from '../../state.js';

const useInferRouter = (router: Router) => {

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

}

export { useInferRouter }