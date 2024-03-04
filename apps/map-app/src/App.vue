<script setup lang="ts">
import Map from "./components/Map.vue";
import Analytics from "./components/Analytics.vue";
</script>

<template>
	<div
		class="grid grid-cols-2 gap-[var(--gap)] p-[var(--gap)] h-screen w-screen relative bg-black"
	>
		<Map class="bg-background rounded-[var(--gap)] overflow-hidden" />

		<Analytics />
	</div>
</template>
