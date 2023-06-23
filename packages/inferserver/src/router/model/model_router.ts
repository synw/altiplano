import Router from "koa-router"
import { koaBody } from "koa-body";
import { lm, onReady, models } from '../../state.js';

const useModelRouter = (router: Router) => {

  router.get('/model/all', async (ctx) => {
    await onReady;
    ctx.type = 'application/json';
    ctx.body = models;
    ctx.status = 200;
  });

  router.post('/model/select', koaBody(), async (ctx) => {
    await onReady;
    const body = ctx.request.body;
    const modelName = body["name"];
    const model = models.find(obj => obj.name === modelName);
    if (!model) {
      console.warn(`Model ${modelName} not found`);
      ctx.status = 404
    } else {
      await lm.loadModel(model.path);
      ctx.type = 'application/json';
      ctx.body = model;
      ctx.status = 200;
    }
  });
}

export { useModelRouter }