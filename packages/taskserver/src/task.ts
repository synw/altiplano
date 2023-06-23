import { LmTask } from "./interfaces.js";
import { lm as _lm } from "@altiplano/inferserver";
import { useLlama } from "@altiplano/usellama";
import { LoadConfig } from "llama-node/dist/llm/llama-cpp.js";
import { OptionalModelParams } from "@altiplano/types";

function _checkConf(conf: Record<string, any>) {
  if (!("name" in conf)) {
    throw new Error("Provide a name param in your task")
  }
  if (!("model" in conf)) {
    throw new Error("Provide a model param in your task")
  }
  if (!("template" in conf)) {
    throw new Error("Provide a template param in your task")
  }
}

function taskFromConf(conf: Record<string, any>): LmTask {
  _checkConf(conf);
  const t: LmTask = {
    name: conf.name,
    model: conf.model,
    template: conf.template,
  }
  if ("templateVars" in conf) {
    t.templateVars = conf.templateVars;
  }
  if ("inferParams" in conf) {
    t.inferParams = conf.inferParams;
  }
  if ("modelConf" in conf) {
    const raw: Array<Record<string, any>> = conf.modelConf;
    const _conf: OptionalModelParams = {};
    raw.forEach((param) => {
      const name = Object.keys(param)[0];
      const value = Object.values(param)[0];
      _conf[name] = value;
    });
    t.modelConf = _conf;
  }
  return t
}

async function execute(prompt: string, task: LmTask, lm?: ReturnType<typeof useLlama>) {
  const lmx = lm ? lm : _lm;
  if (task.inferParams) {
    lmx.params(task.inferParams);
  }
  return await lmx.infer(prompt, task.template, task.templateVars);
}

function _compareModelConf(currentConf: LoadConfig, newConf: OptionalModelParams): boolean {
  if (currentConf.nCtx !== newConf.nCtx) {
    return true
  }
  if (currentConf.enableLogging !== newConf.enableLogging) {
    return true
  }
  if (currentConf.seed !== newConf.seed) {
    return true
  }
  if (currentConf.f16Kv !== newConf.f16Kv) {
    return true
  }
  if (currentConf.logitsAll !== newConf.logitsAll) {
    return true
  }
  if (currentConf.vocabOnly !== newConf.vocabOnly) {
    return true
  }
  if (currentConf.useMlock !== newConf.useMlock) {
    return true
  }
  if (currentConf.embedding !== newConf.embedding) {
    return true
  }
  if (currentConf.useMmap !== newConf.useMmap) {
    return true
  }
  if (currentConf.nGpuLayers !== newConf.nGpuLayers) {
    return true
  }
  return false
}

function checkModelReload(
  task: LmTask,
  currentModelName: string,
  currentConf: LoadConfig,
  newConf: OptionalModelParams,
): boolean {
  let reloadModel = false;
  if (task.model != currentModelName) {
    return true;
  }
  reloadModel = _compareModelConf(currentConf, newConf);
  return reloadModel
}

export { taskFromConf, execute, checkModelReload }