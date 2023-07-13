<template>
  <div @click="setMaxTokens()">
    <div class="text-sm flex flex-row w-full 3xl:max-w-[28rem] items-center">
      <div class="text-center danger" :style="`width:${templatePercent}%`">{{ templateTokensCount }}</div>
      <div class="text-center warning" :style="`width:${promptPercent}%`">{{ promptTokensCount }}</div>
      <div class="flex-grow text-center success">{{ freeCtx }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { inferParams, promptTokensCount, templateTokensCount } from './state';
import { lmState } from '@/state';

const freeCtx = computed(() => {
  return Math.round(lmState.ctx - (promptTokensCount.value + templateTokensCount.value))
});
const promptPercent = computed(() => {
  return Math.round((promptTokensCount.value * 100) / lmState.ctx)
});
const templatePercent = computed(() => {
  return Math.round((templateTokensCount.value * 100) / lmState.ctx)
});

function setMaxTokens() {
  inferParams.tokens = freeCtx.value;
}
</script>