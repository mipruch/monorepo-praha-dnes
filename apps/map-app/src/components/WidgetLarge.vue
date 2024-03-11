<script setup lang="ts">
import {ref, watch} from "vue";
import WidgetBase from "./WidgetBase.vue";
import List from "./graphs/List.vue";
import Bar from "./graphs/Barchart.vue";

const props = defineProps<{
	title: string;
	graph: any;
}>();

const componentRegistry = {
	List,
	Bar,
};

const chosenComponent = eval(props.graph.type);

// const text = ref(props.title);

// if (text.value?.match("\{\{.*?\}\}")) {
// 	replaceText();
// 	watch(
// 		() => props,
// 		() => {
// 			replaceText();
// 		}
// 	);
// }

// function replaceText() {
// 	text.value = props.title.replace(/\{\{(.*?)\}\}/g, (match, p1) => {
// 		return "" + props.value;
// 	});
// }
</script>
<template>
	<WidgetBase>
		<div class="w-[268px] grid grid-rows-[min-content_1fr] h-full">
			<p class="font-semibold mb-3">{{ props.title }}</p>
			<component :is="chosenComponent" :graph="props.graph" />
		</div>
	</WidgetBase>
</template>
