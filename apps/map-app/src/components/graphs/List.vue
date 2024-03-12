<script setup lang="ts">
const props = defineProps<{
	graph: {
		type: string;
		paragraph: string;
		items: string[];
	};
}>();
</script>

<template>
	<div class="text-sm">
		<p class="text-sm mb-3">{{ props.graph.paragraph }}</p>
		<ol class="list-decimal opacity-50 pl-4">
			<li
				v-for="item in props.graph.items.slice(0, 10)"
				class="pl-1 leading-5"
			>
				{{ item }}
			</li>
		</ol>
	</div>
</template>
