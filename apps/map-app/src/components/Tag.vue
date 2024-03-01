<script setup lang="ts">
const props = defineProps({
	color: {
		type: String,
		default: "green",
	},
	text: {
		type: String,
		default: "",
	},
	big: {
		default: false,
		type: Boolean,
	},
});

const colorScheme: {[key: string]: string} = {
	green: "bg-green text-black",
	dark: "bg-grey-dark text-white",
	light: "bg-grey-300 text-black",
	notice: "bg-[#FF5A00] text-black",
};
</script>

<template :slots="['name']">
	<div
		class="uppercase tracking-tag rounded-tag w-max pt-[0.4em] pb-[0.35em] pl-[0.9em] pr-[0.7em]"
		:class="[props.big ? 'text-sm' : 'text-3sm', colorScheme[props.color]]"
		v-if="props.text"
	>
		{{ props.text }}
	</div>
</template>
