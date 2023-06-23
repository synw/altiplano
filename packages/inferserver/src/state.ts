import { fileURLToPath } from 'url';
import path from 'path';
import { BaseLMContract } from '@altiplano/types';
import { useLlama } from "@altiplano/usellama";
import { wsMsg, initWs } from "./ws.js";


const __filename = fileURLToPath(import.meta.url);
const dirpath = path.dirname(__filename);
const execPath = process.cwd();

// infer server state
let setReady: (value: unknown) => void;
let onReady = new Promise((r) => setReady = r);
let enableWs = true;
const models = new Array<BaseLMContract>();

// lm state
let lm = useLlama({
  onToken: wsMsg,
  onStartInfer: () => wsMsg("#!Start#"),
  onEndInfer: () => wsMsg("#!Stop#"),
  verbose: true
});

function initLm(_lm?: ReturnType<typeof useLlama>): ReturnType<typeof useLlama> {
  if (_lm) {
    lm = _lm
  } else {
    if (enableWs == false) {
      lm = useLlama({ verbose: true })
    }
  }
  return lm
}

function initWebsockets(enable: boolean, port: number) {
  initWs(enable, port)
}

function initModels(m: Array<string>, dir: string) {
  m.forEach((row) => {
    models.push({
      name: row.replace(".bin", ""),
      path: path.join(dir, row),
    });
  });
}

function setWsMode(_enableWs: boolean) {
  enableWs = _enableWs
}

export {
  execPath,
  onReady,
  lm,
  dirpath,
  enableWs,
  models,
  setReady,
  initLm,
  initWebsockets,
  initModels,
  setWsMode,
}