import { LoadConfig } from "llama-node/dist/llm/llama-cpp.js";
import type { Generate } from "@llama-node/llama-cpp";

const defaultModelConf: LoadConfig = {
  modelPath: "",
  nCtx: 2048,
  enableLogging: true,
  seed: 0,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
  nGpuLayers: 0,
}

const defaultInferenceParams: Generate = {
  prompt: "",
  nThreads: 4,
  nTokPredict: 1024,
  temp: 0.2,
}

export { defaultInferenceParams, defaultModelConf }