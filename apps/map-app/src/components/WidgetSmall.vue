<script setup lang="ts">
import {ref, watch} from "vue";
import WidgetBase from "./WidgetBase.vue";

const props = defineProps<{
	title: string;
	value: string | number;
	text: string;
}>();

const text = ref(props.text);

if (text.value?.match("\{\{.*?\}\}")) {
	replaceText();
	watch(
		() => props,
		() => {
			replaceText();
		}
	);
}

function replaceText() {
	text.value = props.text.replace(/\{\{(.*?)\}\}/g, (match, p1) => {
		return "" + props.value;
	});

	text.value = text.value.replace(/\~\~(.*?)\~\~/g, (match, p1) => {
		return "<span class=text-blue>" + p1 + "</span>";
	});
}
</script>
<template>
	<WidgetBase>
		<div class="grid h-[124px] w-[210px] items-start">
			<div class="flex flex-col h-full">
				<p class="font-semibold mb-auto">{{ props.title }}</p>
				<p class="text-3xl font-semibold mb-3">{{ props.value }}</p>
				<p class="text-sm text-grey-600" v-html="text" />
			</div>
		</div>
	</WidgetBase>
</template>
