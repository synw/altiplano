# Altiplano tasks server

A language model tasks api server. Serve tasks from simple yaml files

## Install:

```bash
yarn global add @altiplano/taskserver
# or 
npm install -g @altiplano/taskserver
```

## Usage

### Create a task

Create a tasks folder and put a task in subfolders:

```bash
mkdir tasks
cd tasks
mkdir code
cd code
mkdir json
touch fix.yml
```

The task content:

```yaml
name: fix_json
model: open-llama-7B-open-instruct.ggmlv3.q5_1
modelConf:
  - nCtx: 512
inferParams:
  - topK: 40,
  - topP: 0.1,
  - temp: 0,
  - repeatPenalty: 1
template: |-
  ### Instruction: Fix this invalid json:

  {prompt}
  ### Response: (Answer only with json)
```

A task is a model with it's config, some inference parameters and a template. Doc:
[models conf params](https://github.com/synw/altiplano/tree/main/packages/usellama#loading-a-model), 
[inference params](https://github.com/synw/altiplano/tree/main/packages/usellama#inference-parameters)

### Run the tasks server

### Command

Use the following command:

```bash
taskserver path/to/models/dir path/to/tasks/folder model_to_run-optional
```

Example:

```bash
taskserver /an/absolute/path/to/models/dir task open-llama-7B-open-instruct.ggmlv3.q5_1.bin
```

This will load the model at startup if a model name is provided

### As library

Run your own server using the library:

```ts
#!/usr/bin/env node

import { argv, exit } from "process";
import { useTaskServer } from "@altiplano/taskserver";


function _runserver(modelsDirPath, tasksDir, loadModel) {
  const { app } = useTaskServer(
    tasksDir,
    [],
    {
      modelsDirPath: modelsDirPath,
      loadModel: loadModel,
    },
    true,
  );
  app.listen(5143, () => {
    console.log("Tasks server running on port 5143");
  });
}
```

Parameters of `useTaskServer`:

- `tasksDir`: *string* **required**: the directory where the tasks are
- `routes`: *Array<(r: Router) => void>*: optional extra routes. Check the [inferserver doc](https://github.com/synw/altiplano/tree/main/packages/inferserver#router-options)
- `params`: *InferServerParams*: the server params: one is required: `modelsDirPath`, the path to the models directory
- `verbose`: *boolean*: verbosity (default *false*)

### Execute a task

Hit the `/task/execute` endpoint with a prompt and a task name:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"prompt": "{\"a\":1,}", \
   "task": "code/json/fix"}' http://localhost:5143/task/execute
```

