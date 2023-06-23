import path from "path";
import Router from "koa-router"
import { koaBody } from "koa-body";
import { onServerReady, lm } from "@altiplano/inferserver"
import { defaultModelConf } from "@altiplano/usellama"
import { modelsDir, tasksDir, verbose } from "./state.js";
import { readTask } from "./cmds/read_task.js";
import { checkModelReload, execute } from "./task.js";


const useTaskRouter = (
  router: Router,
) => {
  router.post('/task/execute', koaBody(), async (ctx) => {
    await onServerReady;
    // read request
    const body = ctx.request.body;
    const tp = body["task"];
    const prompt = body["prompt"];
    // get the task
    const taskPath = path.join(tasksDir, tp + ".yml");
    const { task, found } = readTask(taskPath);
    if (!found) {
      ctx.body = "Task not found";
      ctx.status = 400;
    }
    // check the model params
    const reloadModel = checkModelReload(
      task,
      lm.model.name,
      lm.model.config,
      task.modelConf ?? defaultModelConf
    )
    if (reloadModel) {
      if (verbose) {
        console.log("Reloading model ..")
      }
      await lm.loadModel(path.join(modelsDir, task.model + ".bin"), task.modelConf ?? {})
    }
    // execute the task
    if (verbose) {
      console.log("Execute task:")
      console.log(task);
    }
    const res = await execute(prompt, task);
    // response
    if (res.completed) {
      ctx.type = 'application/json';
      ctx.body = res;
      ctx.status = 200;
    } else {
      ctx.status = 202;
    }
  });
}

export { useTaskRouter }