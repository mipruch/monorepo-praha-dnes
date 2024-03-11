<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import Button from "./ui/button/Button.vue";
import {Trash2} from "lucide-vue-next";
import WidgetMedium from "./WidgetMedium.vue";
import WidgetSmall from "./WidgetSmall.vue";
import WidgetLarge from "./WidgetLarge.vue";

defineEmits(["removeLayer"]);
const {layerData} = defineProps<{
	layerData: {
		pref: any;
		res: any;
	};
}>();

function handleValue(value: string | any) {
	if (typeof value === "string") {
		return value;
	}

	if (typeof value === "object") {
		const pathToAttribute = value.attributePath.arrayPath.split(".");

		const arrayOfValues: number[] = [];

		layerData.res.features.forEach((feature: any) => {
			const array = pathToAttribute.reduce(
				(acc: any, curr: any) => acc[curr],
				feature.properties
			);

			array.forEach((component: any) => {
				const pathToType = value.attributePath.where.path.split(".");

				const foundCategory = pathToType.reduce(
					(acc: any, curr: any) => acc[curr],
					component
				);
				if (foundCategory === value.attributePath.where.equals) {
					const pathToValue =
						value.attributePath.valuePath.split(".");
					const foundValue = pathToValue.reduce(
						(acc: any, curr: any) => acc[curr],
						component
					);
					arrayOfValues.push(foundValue);
				}
			});
		});

		const mathOperation = value.mathOperation;

		let returnValue;
		if (mathOperation === "sum") {
			returnValue = arrayOfValues.reduce((a: any, b: any) => a + b, 0);
		}
		if (mathOperation === "average") {
			returnValue =
				arrayOfValues.reduce((a: any, b: any) => a + b, 0) /
				arrayOfValues.length;
		}

		return returnValue.toFixed(2);
	}
}
</script>

<template>
	<div class="p-4 bg-grey-200 dark:bg-grey-700 rounded-lg">
		<div>
			<div class="flex flex-row justify-between pb-4">
				<Tags big v-slot="slotProps">
					<Tag
						color="green"
						:text="layerData.pref.category"
						:big="slotProps.big"
					/>
					<Tag
						color="light"
						:text="layerData.pref.name"
						:big="slotProps.big"
					/>
				</Tags>
				<Button
					variant="ghost"
					size="icon"
					@click="$emit('removeLayer')"
				>
					<Trash2 />
				</Button>
			</div>
			<p class="pl-1 mb-8">
				{{ layerData.pref.paragraph }}
			</p>
		</div>
		<div class="w-full overflow-x-scroll flex flex-row gap-[10px]">
			<div
				id="widgets-small"
				class="grid grid-flow-col grid-rows-2 gap-[10px]"
			>
				<WidgetSmall
					v-for="widget in layerData.pref.widgets?.small"
					:title="widget.title"
					:value="handleValue(widget.value)"
					:text="widget.text"
				/>
			</div>
			<div
				id="widgets-medium"
				class="grid grid-flow-col grid-rows-2 gap-[10px]"
			>
				<WidgetMedium
					v-for="widget in layerData.pref.widgets?.medium"
					:title="widget.title"
					:graph="widget.graph"
					:description="widget.description"
				/>
			</div>
			<div
				id="widgets-large"
				class="grid grid-flow-col grid-rows-1 gap-[10px]"
			>
				<WidgetLarge
					v-for="widget in layerData.pref.widgets?.large"
					:title="widget.title"
					:graph="widget.graph"
				/>
			</div>
		</div>
	</div>
</template>
