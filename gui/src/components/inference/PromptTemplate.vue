<template>
  <div class="px-3 mb-12 form">
    <div class="flex flex-col">
      <div class="pt-3">
        <Textarea v-model="template.content" autoResize class="w-full" />
      </div>
      <div class="pt-2">
        <Textarea v-model="prompt" rows="1" class="w-full" autoResize />
      </div>
      <div class="flex flex-row justify-end pt-3 space-x-2" v-if="lmState.isModelLoaded">
        <button class="btn txt-light" v-show="stream.length > 0 && !lmState.isRunning" @click="stream = ''">Clear</button>
        <button class="btn txt-light" v-show="template.content.length > 0" @click="toggleSaveTemplate($event)">Save
          template</button>
        <OverlayPanel ref="saveTemplateCollapse">
          <save-template-dialog class="p-3 mt-3" @pick="toggleSaveTemplate($event)"></save-template-dialog>
        </OverlayPanel>
        <button class="btn txt-light" v-show="prompt.length > 0" @click="toggleSavePrompt($event)">Save prompt</button>
        <OverlayPanel ref="savePromptCollapse">
          <save-prompt-dialog class="p-3 mt-3" @pick="toggleSavePrompt($event)"></save-prompt-dialog>
        </OverlayPanel>
        <button class="flex flex-row w-48 btn bord-light txt-light block-lighter" @click="processInfer()"
          v-show="lmState.isRunning == false" :disabled="prompt.length == 0">
          <i-iconoir:play class="mr-2 text-xl"></i-iconoir:play>
          <div>Run inference</div>
        </button>
        <button v-show="lmState.isRunning == true || lmState.isStreaming == true" class="w-48 btn lighter"
          @click="abort()">Stop</button>
      </div>
      <div v-if="lmState.isRunning == true && lmState.isStreaming == false">
        <LoadingSpinner class="pt-16 text-6xl txt-lighter" />
      </div>
      <div id="infer-result" class="mt-8 mb-12 overflow-auto text-justify"
        v-html="stream.replaceAll('\n', '<br />').replaceAll('\t', '&nbsp;&nbsp;')">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import Textarea from 'primevue/textarea';
import { lmState, stream } from '@/state';
import { infer, abort } from "@/services/api";
import LoadingSpinner from '@/widgets/LoadingSpinner.vue';
import SavePromptDialog from './SavePromptDialog.vue';
import SaveTemplateDialog from './SaveTemplateDialog.vue';
import { template, prompt, inferParams, inferResults, secondsCount } from './state';

const savePromptCollapse = ref();
const saveTemplateCollapse = ref();

async function processInfer() {
  inferResults.tokensPerSecondTimeline.splice(0, inferResults.tokensPerSecondTimeline.length);
  inferResults.totalTokens = 0;
  secondsCount.value = 0;
  const id = setInterval(() => {
    secondsCount.value++;
    const tps = parseFloat((inferResults.totalTokens / secondsCount.value).toFixed(1));
    inferResults.tokensPerSecond = tps;
    inferResults.tokensPerSecondTimeline.push(tps);
  }, 1000);
  const res = await infer(prompt.value, template.value.content, inferParams);
  clearInterval(id);
  inferResults.thinkingTimeFormat = res.thinkingTimeFormat;
  inferResults.emitTimeFormat = res.emitTimeFormat;
  inferResults.totalTimeFormat = res.totalTimeFormat;
}

function toggleSavePrompt(evt) {
  savePromptCollapse.value.toggle(evt);
}

function toggleSaveTemplate(evt) {
  saveTemplateCollapse.value.toggle(evt);
}
</script>