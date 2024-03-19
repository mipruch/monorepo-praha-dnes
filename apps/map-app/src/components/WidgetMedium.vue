<script setup lang="ts">
import {ref, watch} from "vue";
import WidgetBase from "./WidgetBase.vue";

import {formatNumber} from "@/lib/utils";

const props = defineProps<{
	title: string;
	description?: string;
	graph: any;
}>();

const chosenComponent = props.graph.type;

const description = ref(props.description);

if (description.value?.match("\{\{.*?\}\}")) {
	description.value = description.value.replace(
		/\{\{(.*?)\}\}/g,
		(match, p1) => {
			return formatNumber(props.graph[p1], 1);
		}
	);
	description.value = description.value.replace(
		/\~\~(.*?)\~\~/g,
		(match, p1) => {
			return "<span class=text-blue>" + p1 + "</span>";
		}
	);

	watch(
		() => props.graph,
		() => {
			description.value = props.description!.replace(
				/\{\{(.*?)\}\}/g,
				(match, p1) => {
					return formatNumber(props.graph[p1], 1);
				}
			);
		}
	);
}
</script>
<template>
	<WidgetBase
		v-if="['Ring', 'Tachometer', 'Nearby'].includes(props.graph.type)"
	>
		<div class="grid grid-cols-[55%_1fr] w-[268px] h-[124px] items-start">
			<div class="flex flex-col h-full">
				<p class="font-semibold mb-1">{{ props.title }}</p>
				<p class="text-sm text-grey-600" v-html="description" />
			</div>
			<div
				class="w-full h-full grid items-center justify-center relative"
				v-if="props.graph"
			>
				<component :is="chosenComponent" :graph="props.graph" />
			</div>
		</div>
	</WidgetBase>

	<!-- HORIZONTAL -->
	<WidgetBase v-else>
		<div class="grid w-[268px] h-[124px] items-start">
			<div class="flex flex-col h-full">
				<p class="font-semibold mb-1">{{ props.title }}</p>
				<p class="text-sm text-grey-600" v-html="description" />
			</div>
			<div class="w-full h-full" v-if="props.graph">
				<component :is="chosenComponent" :graph="props.graph" />
			</div>
		</div>
	</WidgetBase>
</template>
