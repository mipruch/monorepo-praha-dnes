<script setup lang="ts">
const props = defineProps({
	big: {
		default: false,
		type: Boolean,
	},
});
</script>

<template>
	<div
		class="inline-flex flex-wrap"
		:class="[props.big ? 'gap-[10px]' : 'gap-[8px]']"
	>
		<slot :big="props.big" />
	</div>
</template>
