import { reactive, ref } from "vue";
import { ApiResponse, useApi } from "restmix";
import { User } from "@snowind/state";
import { useWs } from "@/ws";
import { loadModels } from "@/services/api";
import { msg } from "./services/notify";
import { inferResults } from "./components/inference/state";
import { useDb } from "./services/db";

const user = new User();
const api = useApi({
  "serverUrl": "http://localhost:5143"
});
const db = useDb();
//const currentModel = useStorage<string>("model", {} as LMContract);
//const currentTask = useStorage("task", {} as TaskContract);
const lmState = reactive({
  isRunning: false,
  isStreaming: false,
  isLoadingModel: false,
  isModelLoaded: false,
  model: "",
  ctx: 1024,
});
const stream = ref("");
const models = reactive<Array<string>>([]);
const prompts = reactive<Array<string>>([]);
const templates = reactive<Array<string>>([]);
//const tasks = reactive<Array<TaskContract>>([]);

async function initState() {
  db.init().then(async () => {
    loadPrompts();
    loadTemplates();
  });
  useWs(
    (data) => {
      stream.value = stream.value + data;
      ++inferResults.totalTokens
    },
    () => lmState.isStreaming = true,
  );
  api.onResponse(async <T>(res: ApiResponse<T>): Promise<ApiResponse<T>> => {
    if (!res.ok) {
      if ([401, 403].includes(res.status)) {
        const err = `${res.status} from ${res.url}`;
        msg.error("Unauthorized request", err);
        console.error(err)
      } else if (res.status == 500) {
        const err = `${res.status} from ${res.url}`;
        msg.error("Server error", err);
        console.error(err)
      } else {
        const err = `${res.status} from ${res.url}`;
        msg.error("Error", err);
        console.error(err)
      }
    }
    return res
  });
  await loadModels();
}

function mutateModel(_model: string, _ctx: number) {
  lmState.model = _model;
  lmState.ctx = _ctx;
  lmState.isModelLoaded = true;
}

async function loadPrompts() {
  const p = await db.listPromptsNames();
  prompts.splice(0, prompts.length, ...p);
}

async function loadTemplates() {
  const t = await db.listTemplatesNames();
  templates.splice(0, templates.length, ...t);
}

export {
  user,
  api,
  lmState,
  stream,
  models,
  db,
  prompts,
  templates,
  //tasks, 
  //currentTask, 
  initState,
  mutateModel,
  loadPrompts,
  loadTemplates,
}