# Altiplano inference server

The base inference server library. Powered by [Koa](https://github.com/koajs/koa)

## Install:

```bash
yarn global @altiplano/inferserver
# or 
npm install @altiplano/inferserver
```

## Usage

To run a server:

```js
import { useInferServer } from "@altiplano/inferserver";

const { app } = useInferServer({
  enableWs: false,
  modelsDirPath: "/an/absolute/path/to/models/dir",
  loadModel: "open-llama-7B-open-instruct.ggmlv3.q5_1.bin",
});
// run the server
app.listen(5143, () => {
  console.log("Server running on port 5143");
});
```

Options:

- `modelsDirPath`: *string* **required**: the path to the models directory
- `loadModel`: *string*: a model name to load at startup
- `enableWs`: *boolean*: enable websockets (default *true*)
- `router`: *Router*: a Koa router
- `lm`: *ReturnType<typeof useLlama>*: an instance of the useLlama composable
- `wsPort`: *number*: the websockets port (default *5142*)
- `uiDir`: *string*: serve a directory with an *index.html*

To use a model instance with custom parameters:

```js
import { useLlama } from "@altiplano/usellama";
import { useInferServer } from "@altiplano/inferserver";

const lm = useLlama({
  temp: 0.8,
  nTokPredict: 512,
});
const { app } = useInferServer({
  modelsDirPath: "/an/absolute/path/to/models/dir",
  loadModel: "open-llama-7B-open-instruct.ggmlv3.q5_1.bin",
  lm: lm,
})
```

## Endpoints

### Models

- `/model/all` *GET*: a list of the available models
- `/model/select` *POST*: load a model from it's name. Params: `name` *string*

Example:

```ts
const models = await api.get<Array<LMContract>>("/model/all");
// select a model
await api.post("/model/select", {"name": "open-llama-7B-open-instruct.ggmlv3.q5_1"});
```

Once a model is loaded you can run inference

### Inference

Enpoint to run inference:

- `/model/infer` *GET*: run inference from a prompt and template. Params: 
  - `prompt` *string* **required**: the prompt text
  - `template` *string*: the template to use (default *{prompt}*)
  - `templateVars` *string*: the template variables to use


#### Examples

Using curl:

```bash
curl -X POST -H "Content-Type: application/json" -d \
  '{"prompt": "List the planets in the solar system", \
  "template": "### Instruction: {prompt}\n### Response:"}' http://localhost:5143/infer
```

Using Typescript:

```ts
import { InferResponseContract } from "@altiplano/inferserver";

const inferenceResult = await api.post<InferResponseContract>("/api/infer", {
    "prompt": "List the planets in the solar system",
    "template": "### Instruction: {prompt}\n### Response:"
  });
```

To abort a running inference:

```ts
await api.get("/api/abort");
```

## Websockets

By default the websockets are enabled. To connect to the inference response flow:

```ts
const ws = new WebSocket('ws://localhost:5142');
ws.onmessage = (event) => {
  const msg = event.data;
  doSomething(msg)
};
```

## Router options

It is possible to add extra routes to the default router or use a custom router.

### Extra routes

Add your extra routes:

```ts
import { useInferServer, useLmRouter, onServerReady } from "@altiplano/inferserver";

const routes = new Array([
  (router) => {
      router.get('/myroute', async (ctx) => {
      await onServerReady;
      // do something
      ctx.status = 204;
    });
  }
]);
const router = useLmRouter(routes);
const { app } = useInferServer({
  modelsDirPath: "/an/absolute/path/to/models/dir",
  router: router,
});
```

### Disable models api

To use only one model and disable the switch models api:

```ts
const router = useLmRouter({
  useModelsRoutes: false
});
const { app } = useInferServer({
  modelsDirPath: "/an/absolute/path/to/models/dir",
  router: router,
});
```

## Command

A basic runserver command is available:

```bash
inferserver /an/absolute/path/to/models/dir open-llama-7B-open-instruct.ggmlv3.q5_1.bin
```

## Example

```ts
#!/usr/bin/env node

import { argv, exit } from "process";
import { useInferServer } from "@altiplano/inferserver";

/**
 * A function to start the server with a specified model or all models in the directory.
 * @param modelsDirPath - Path of the directory containing the Models.
 * @param modelName - Optional name of the model to use
 */
function _runserver(modelsDirPath: string, loadModel?: string) {
  const { app } = useInferServer({
    enableWs: false,
    modelsDirPath: modelsDirPath,
    loadModel: loadModel,
  });
  app.listen(5143, () => {
    console.log("Server running on port 5143");
  });
}

async function main() {
  let modelsDir = "";
  let modelName: string | undefined = undefined;
  if (argv.length > 2) {
    let i = 0;
    for (const arg of argv.slice(2, argv.length)) {
      if (i == 0) {
        modelsDir = arg;
      } else {
        modelName = arg;
      }
      ++i
    }
  }
  _runserver(modelsDir, modelName);
}

(async () => {
  try {
    if (argv.length < 3) {
      console.warn("Provide a models directory path as argument")
      exit(1)
    }
    await main();
  } catch (e) {
    throw e
  }
})();
```
