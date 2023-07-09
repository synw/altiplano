import { api, models, mutateModel, stream, lmState } from "@/state";
import type { InferParams, InferResultContract } from "@/interfaces";
import { ModelStateContract } from "@/interfaces";


async function infer(_prompt: string, _template: string, _params: InferParams): Promise<InferResultContract> {
  stream.value = "";
  lmState.isRunning = true;
  const res = await api.post<InferResultContract>("/infer", {
    "prompt": _prompt,
    "template": _template,
    ..._params,
  });
  if (res.ok) {
    console.log("RES", res)
  }
  lmState.isRunning = false;
  lmState.isStreaming = false;
  return res.data
}

async function abort() {
  const res = await api.get("/infer/abort");
  if (res.ok) {
    lmState.isRunning = false;
    lmState.isStreaming = false;
  }
}

async function loadModels() {
  const res = await api.get<ModelStateContract>("/model/state");
  console.log(JSON.stringify(res.data, null, "  "))
  if (res.ok) {
    models.splice(0, models.length, ...res.data.models);
    if (res.data.isModelLoaded) {
      mutateModel(res.data.loadedModel, res.data.ctx)
    }
  }
}

/*async function loadTasks() {
  const res = await api.get<Array<TaskContract>>("/api/task/all");
  if (res.ok) {
    tasks.splice(0, models.length, ...res.data)
  }
}*/

async function selectModel(name: string, ctx: number) {
  lmState.isLoadingModel = true;
  const res = await api.post("/model/load", { model: name, ctx: ctx });
  if (res.ok) {
    mutateModel(name, ctx);
  }
  lmState.isLoadingModel = false;
}

export { infer, abort, loadModels, selectModel }