import { OptionalInferenceParams, OptionalModelParams, TemplateVar } from "@altiplano/types";

interface LmTask {
  name: string;
  model: string;
  template: string;
  templateVars?: Array<TemplateVar>;
  inferParams?: OptionalInferenceParams;
  modelConf?: OptionalModelParams;
}

export { LmTask }