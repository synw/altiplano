<template>
  <div>
    <div v-if="inferResults" class="flex flex-col">
      <div>Tokens: {{ inferResults.totalTokens }}</div>
      <div>Tokens/sec: {{ inferResults.tokensPerSecond }}</div>
      <div>Thinking time: {{ inferResults.thinkingTimeFormat }}</div>
      <div>Emit time: {{ inferResults.emitTimeFormat }}</div>
      <div>Total time: {{ inferResults.totalTimeFormat }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inferResults } from './state';
</script>