# Use Llama composable

A composable to run [Llama.cpp](https://github.com/ggerganov/llama.cpp) with [Llama-node](https://github.com/Atome-FE/llama-node)

## Install

```bash
npm install @altiplano/usellama
# or
yarn add @altiplano/usellama
```

## Example usage

```ts
import { useLlama } from "@altiplano/usellama";

const lm = useLlama({verbose: true});
await lm.loadModel(modelPath);
const template = `### Instruction: Fix this invalid json:

{prompt}
### Response: (answer in json)`;
const result = await lm.infer('{"a":1,}', template);
```

## Api

### Initialization

Optional initialization parameters:

- `onToken`: *(message: any) => void* : a function executed on each token emission
- `onStartInfer`: *(message: any) => void* : a function executed when the token emission starts
- `onEndInfer`: *(message: any) => void* : a function executed when the token emission stops
- `verbose`: *boolean* : output info and the inference text

Example:

```ts
const lm = useLlama({
  onToken: (t) => process.stdout.write(t),
  onEndInfer: () => doSomething()
});
```

### Loading a model

To load a model use the `loadModel` function and pass it optional parameters:

- `modelPath`: *string* : the absolute path to the model. Not necessary if it was preloaded with `useModel` (see below)
- `params`: *OptionalModelParams*: the optional parameters

Detail of the `OptionalModelParams`:

- `nCtx`: *number* : context window size (default *2048*)
- `nGpuLayers`: *number* : number of CPU layers to use (default *0*)
- `seed`: *number* : (default *0*)
- `f16Kv`: *boolean* : (default *false*)
- `logitsAll`: *boolean* : (default *false*)
- `vocabOnly`: *boolean* : (default *false*)
- `useMlock`: *boolean* : (default *false*)
- `embedding`: *boolean* : (default *false*)
- `useMmap`: *boolean* : (default *true*)
- `enableLogging`: *boolean* : (default *true*)

Example:

```ts
await lm.loadModel(
  "/an/absolute/path/open-llama-7B-open-instruct.ggmlv3.q5_1.bin", 
  { nCtx: 1024 }
);
```

To use a model without actually loading it into the memory:

```ts
await lm.useModel(
  "/an/absolute/path/open-llama-7B-open-instruct.ggmlv3.q5_1.bin", 
  { nCtx: 1024 }
);
```

If the model is preloaded like this, no need to use parameters for `loadModel`. Also
when using the `infer` function (see below) if the model is preloaded it will be loaded
in the memory at the first inference request.

An `unloadModel` function is also available

### Run inference

To run inference use the `infer` function with parameters:

- `prompt`: *string* **required**: the prompt text
- `template`: *string* : (default *{prompt}*): the template to use. A *{prompt}* template variable is available
- `templateVars`: *Array<TemplateVar>* : extra template variables to use

Example:

```ts
const template = `### Instruction: Fix this invalid json:

{prompt}
### Response: (answer in json)`;
const result = await lm.infer('{"a":1,}', template);
```

The inference result contains extra information:

```js
{
  tokens: [ ' {"', 'a', '":', ' ', '1', '}', '\n\n<end>\n' ],
  completed: true,
  text: ' {"a": 1}\n\n<end>\n',
  thinkingTime: 5.27,
  inferenceTime: 1.33,
  totalTime: 6.6,
  tokensPerSeconds: 1.1
}
```

### Inference parameters

It is possible to tune the inference parameters with the `params` function. Parameters:

- `nThreads`: *number*: number of cpu threads to use (default *4*)
- `nTokPredict`: *number*: max number of tokens to output (default *4*)
- `logitBias`: *Array<LogitBias>*: logit bias for specific tokens (default *null*)
- `topK`: *number*: top k tokens to sample from (default *40*, *1.0* = disabled)
- `topP`: *number*: top p tokens to sample from (default *0.95*, *1.0* = disabled)
- `tfsZ`: *number*: tail free sampling (default *1.0* - disabled)
- `temp`: *number*: temperature (default *0.2*, *1.0* = disabled)
- `typicalP`: *number*: locally typical sampling (default *1.0* - disabled)
- `repeatPenalty`: *number*: repeat penalty (default *1.10*, *1.0* = disabled)
- `repeatLastN`: *number*: last n tokens to penalize (default *64*, 0 = disable penalty, -1 = context size)
- `frequencyPenalty`: *number*: frequency penalty (default *0*, *1.0* = disabled)
- `presencePenalty`: *number*: presence penalty (default *0*, *1.0* = disabled)
- `mirostat`: *number*: Mirostat 1.0 algorithm (default *0*, *0* = disabled)
- `mirostatTau`: *number*: the target cross-entropy (or surprise) value you want to achieve for the generated text. A higher value corresponds to more surprising or less predictable text, while a lower value corresponds to less surprising or more predictable text (default *0.1*)
- `mirostatEta`: *number*: the learning rate used to update `mu` based on the error between the target and observed surprisal of the sampled word. A larger learning rate will cause `mu` to be updated more quickly, while a smaller learning rate will result in slower updates (default *0.1*)
- `stopSequence`: *string* : stop emiting sequence (default *null*)
- `penalizeNl`: *number*: consider newlines as a repeatable token (default *true*)

### Abort inference

To abort an inference running use the `abort` function:

```ts
lm.abort();
```

### Model info

To get information about the currently used model a readonly `model` getter is available:

```js
{
  name: 'open-llama-7B-open-instruct.ggmlv3.q5_1',
  path: '/path/to/models/open-llama-7B-open-instruct.ggmlv3.q5_1.bin',
  isLoaded: true,
  isInfering: false,
  config: {
    modelPath: '/path/to/models/open-llama-7B-open-instruct.ggmlv3.q5_1.bin',
    nCtx: 1024,
    enableLogging: true,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
    nGpuLayers: 0
  },
  inferenceParams: {
    prompt: '',
    nThreads: 4,
    nTokPredict: 512,
    logitBias: undefined,
    topK: undefined,
    topP: undefined,
    tfsZ: undefined,
    temp: 0.2,
    typicalP: undefined,
    repeatPenalty: 1,
    repeatLastN: undefined,
    frequencyPenalty: undefined,
    presencePenalty: undefined,
    mirostat: undefined,
    mirostatTau: undefined,
    mirostatEta: undefined,
    stopSequence: undefined,
    penalizeNl: undefined
  }
}
```

## Example

```js
#!/usr/bin/env node

import { argv, exit } from "process";
import { useLlama } from "@altiplano/usellama";

async function main(modelPath) {
  // initialize the lm
  const lm = useLlama({
    onToken: (t) => process.stdout.write(t)
  })
  // load a model
  await lm.loadModel(modelPath, { nCtx: 1024 });
  // set some parameters
  lm.params({
    nTokPredict: 512,
    repeatPenalty: 1,
  })
  // run inference
  const template = "### Instruction: Fix this invalid json:\n\n{prompt}\n### Response: (answer in json)"
  const result = await lm.infer('{"a":1,}', template);
  console.log(result)
}


(async () => {
  try {
    if (argv.length < 3) {
      console.warn("Provide a model path as argument");
      exit(1);
    }
    await main(argv[2]);
    console.log("Finished");
    exit(0);
  }
  catch (e) {
    throw e;
  }
})();
```