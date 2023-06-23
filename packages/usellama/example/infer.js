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

