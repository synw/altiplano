import { reactive, ref } from 'vue';
import llamaTokenizer from 'llama-tokenizer-js';
import { defaultInferenceParams } from '@/const/params';
import { LmTemplate, TemporaryInferResult } from '@/interfaces';
import { templates } from '@/const/templates';
import { db } from '@/state';

const template = reactive<LmTemplate>(templates.alpaca);
const prompt = ref("");
const inferParams = reactive(defaultInferenceParams);
const inferResults = reactive<TemporaryInferResult>({
  tokensPerSecond: 0,
  totalTokens: 0,
  tokensPerSecondTimeline: [],
});
const secondsCount = ref(0);
const promptTokensCount = ref(0);
const templateTokensCount = ref(0);

function countPromptTokens() {
  promptTokensCount.value = llamaTokenizer.encode(prompt.value).length
}

function countTemplateTokens() {
  templateTokensCount.value = llamaTokenizer.encode(template.content).length
}

async function loadTemplate(name: string) {
  const t = await db.loadTemplate(name);
  template.name = t.name;
  template.content = t.content;
  template.vars = t.vars;
  countTemplateTokens();
}

async function loadPrompt(name: string) {
  prompt.value = await db.loadPrompt(name);
  countPromptTokens();
}

function checkMaxTokens(ctx: number) {
  if (inferParams.tokens > ctx) {
    inferParams.tokens = ctx - 64;
  }
}

export {
  template,
  prompt,
  inferParams,
  inferResults,
  secondsCount,
  promptTokensCount,
  templateTokensCount,
  loadTemplate,
  loadPrompt,
  checkMaxTokens,
  countPromptTokens,
  countTemplateTokens,
}