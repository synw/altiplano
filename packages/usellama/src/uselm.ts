import { LLM } from "llama-node";
import type { LLMResult } from "llama-node";
import type { Generate } from "@llama-node/llama-cpp";
import { LLamaCpp, LoadConfig } from "llama-node/dist/llm/llama-cpp.js";
import { OptionalInferenceParams, TemplateVar, InferenceResult, OptionalModelParams } from "@altiplano/types";
import { UseLlamaParams } from "./interfaces.js";
import { formatHrtime } from "./time.js";


const useLlama = (options: UseLlamaParams = {}) => {
  let llama = new LLM(LLamaCpp);
  const model = {
    name: "",
    path: "",
    isLoaded: false,
  }
  let modelConfig: LoadConfig = {
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
  let inferenceParams: Generate = {
    prompt: "",
    nThreads: 4,
    nTokPredict: 1024,
    temp: 0.2,
  }
  let abortController = new AbortController();
  let isInfering = false;

  function _createConfig(modelPath: string, params?: OptionalModelParams) {
    modelConfig = {
      modelPath: modelPath,
      nCtx: params?.nCtx ?? modelConfig.nCtx,
      enableLogging: params?.enableLogging ?? modelConfig.enableLogging,
      seed: params?.seed ?? modelConfig.seed,
      f16Kv: params?.f16Kv ?? modelConfig.f16Kv,
      logitsAll: params?.logitsAll ?? modelConfig.logitsAll,
      vocabOnly: params?.vocabOnly ?? modelConfig.vocabOnly,
      useMlock: params?.useMlock ?? modelConfig.useMlock,
      embedding: params?.embedding ?? modelConfig.embedding,
      useMmap: params?.useMmap ?? modelConfig.useMmap,
      nGpuLayers: params?.nGpuLayers ?? modelConfig.nGpuLayers,
    };
  }

  function _modelNameFromPath(modelPath: string): string {
    return modelPath.split("/").slice(-1)[0].replace(".bin", "")
  }

  const useModel = (modelPath: string, params?: OptionalModelParams) => {
    if (options.verbose) {
      console.log("Using model", modelPath)
    }
    const modelName = _modelNameFromPath(modelPath);
    model.path = modelPath;
    model.name = modelName;
    _createConfig(modelPath, params)
  }

  const loadModel = async (modelPath?: string, params?: OptionalModelParams) => {
    unloadModel();
    if (modelPath) {
      useModel(modelPath, params);
    }
    if (model.path == "") {
      throw new Error("Provide a model path or run useModel before")
    }
    if (options.verbose) {
      console.log("Loading model", modelPath, "with config", modelConfig)
    }
    await llama.load(modelConfig);
    model.isLoaded = true;
  }

  const unloadModel = () => {
    llama = new LLM(LLamaCpp);
    model.path = "";
    model.name = "";
    model.isLoaded = false;
  }

  const abort = () => {
    if (isInfering) {
      abortController.abort()
    } else {
      console.warn("No inference is running, nothing to abort")
    }
  }

  const params = (p: OptionalInferenceParams = {}) => {
    inferenceParams = {
      prompt: "",
      nThreads: p?.nThreads ?? inferenceParams.nThreads,
      nTokPredict: p?.nTokPredict ?? inferenceParams.nTokPredict,
      logitBias: p?.logitBias,
      topK: p?.topK ?? inferenceParams.topK,
      topP: p?.topP ?? inferenceParams.topP,
      tfsZ: p?.tfsZ,
      temp: p?.temp ?? inferenceParams.temp,
      typicalP: p?.typicalP,
      repeatPenalty: p?.repeatPenalty ?? inferenceParams.repeatPenalty,
      repeatLastN: p?.repeatLastN,
      frequencyPenalty: p?.frequencyPenalty,
      presencePenalty: p?.presencePenalty,
      mirostat: p?.mirostat,
      mirostatTau: p?.mirostatTau,
      mirostatEta: p?.mirostatEta,
      stopSequence: p?.stopSequence,
      penalizeNl: p?.penalizeNl
    }
  }

  const infer = async (prompt: string, template?: string, vars: Array<TemplateVar> = []): Promise<LLMResult> => {
    if (model.isLoaded === false) {
      if (model.path.length > 0) {
        await loadModel(model.path);
      } else {
        throw new Error("Load a model before to infer")
      }
    }
    let _prompt = prompt;
    if (template) {
      let parsedTemplate = template;
      for (const _var of vars) {
        parsedTemplate = parsedTemplate.replace(`${_var.name}`, _var.content)
      }
      parsedTemplate = parsedTemplate.replace("{prompt}", prompt);
      _prompt = parsedTemplate;
    }
    const _params = {
      ...inferenceParams,
      prompt: _prompt,
    }
    if (options.verbose) {
      console.log(`Running ${model.name} with params:`);
      console.log(JSON.stringify(inferenceParams, null, "  "));
      console.log("\n------ prompt ------");
      console.log(_prompt);
      console.log("----------------------\n");
    }
    abortController = new AbortController();
    isInfering = true;
    let res: InferenceResult = {
      tokens: [],
      completed: false,
      text: "",
      thinkingTime: 0,
      inferenceTime: 0,
      totalTime: 0,
      tokensPerSeconds: 0,
    };
    let i = 0;
    try {
      const startThinkingTime = process.hrtime();
      let startInferTime: [number, number] = [0, 0];
      const _lmres = await llama.createCompletion(_params, (response) => {
        i++;
        if (i == 1) {
          res.thinkingTime = formatHrtime(process.hrtime(startThinkingTime))
          if (options.verbose) {
            console.log(`Thinking time: ${res.thinkingTime} seconds`);
          }
          startInferTime = process.hrtime();
          if (options.onStartInfer) {
            options.onStartInfer();
          }
        }
        if (options.onToken) {
          options.onToken(response.token);
        }
        if (options.verbose) {
          process.stdout.write(response.token);
        }
        if (response.completed) {
          res.inferenceTime = formatHrtime(process.hrtime(startInferTime));
          if (options.verbose) {
            console.log(`Inference time: ${res.inferenceTime} seconds`);
          }
        }
      },
        abortController.signal);
      res.tokens = _lmres.tokens;
      res.completed = _lmres.completed;
      res.text = _lmres.tokens.join("");
      res.totalTime = parseFloat((res.inferenceTime + res.thinkingTime).toFixed(2));
      res.tokensPerSeconds = parseFloat((res.tokens.length / res.totalTime).toFixed(1));
      if (options.verbose) {
        console.log(`Total time: ${res.totalTime} seconds`);
        console.log(`Response tokens: ${res.tokens.length}`);
        console.log(`Tokens per second: ${res.tokensPerSeconds}`);
      }
    } catch (e) {
      if (`${e}` == "Error: Aborted") {
        if (options.verbose) {
          console.log("Inference aborted")
        }
      } else {
        throw e
      }
    }
    isInfering = false;
    if (options.onEndInfer) {
      options.onEndInfer();
    }
    return res
  }

  return {
    get model() { return model },
    loadModel,
    unloadModel,
    useModel,
    infer,
    abort,
    params,
  }
};

export { useLlama }