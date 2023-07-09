import { reactive, ref } from 'vue';
import { defaultInferenceParams } from '@/const/params';
import { LmTemplate, TemporaryInferResult } from '@/interfaces';
import { templates } from '@/const/templates';
import { db } from '@/state';

const template = ref<LmTemplate>(templates.alpaca);
const prompt = ref("");
const inferParams = reactive(defaultInferenceParams);
const inferResults = reactive<TemporaryInferResult>({
  tokensPerSecond: 0,
  totalTokens: 0,
  tokensPerSecondTimeline: [],
});
const secondsCount = ref(0);

async function loadTemplate(name: string) {
  template.value = await db.loadTemplate(name)
}

async function loadPrompt(name: string) {
  prompt.value = await db.loadPrompt(name)
}

export { template, prompt, inferParams, inferResults, secondsCount, loadTemplate, loadPrompt }