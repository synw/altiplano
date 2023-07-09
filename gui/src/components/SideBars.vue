<template>
  <div>
    <div class="flex flex-row w-full txt-light">
      <button class="w-1/2 p-2 border border-t-0 bord-lighter" :class="activeBar == 'prompts' ? 'border-b-0' : ''"
        @click="openTab('prompts')">Prompts</button>
      <button class="w-1/2 p-2 border border-t-0 border-x-0 bord-lighter"
        :class="activeBar == 'templates' ? 'border-b-0' : ''" @click="openTab('templates')">Templates</button>
    </div>
    <div class="mt-3">
      <prompts-bar v-if="activeBar == 'prompts'"></prompts-bar>
      <templates-bar v-else></templates-bar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PromptsBar from './PromptsBar.vue';
import TemplatesBar from "@/components/TemplatesBar.vue";

type TabType = "prompts" | "templates";

const activeBar = ref<TabType>("prompts");

function openTab(t: TabType) {
  activeBar.value = t
}
</script>