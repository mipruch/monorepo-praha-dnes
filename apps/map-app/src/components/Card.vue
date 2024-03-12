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

type ValueDefinition = {
	mathOperation: "sum" | "average" | "count";
	attributePath:
		| {
				arrayPath: string;
				where: {
					path: string;
					equals: string;
				};
				valuePath: string;
		  }
		| string;
};

function handleGraph(graph: any): any {
	graph.value = handleValue(graph.value);
	return graph;
}

function handleValue(
	value: string | number | ValueDefinition
): string | number {
	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	if (value.mathOperation === "count") {
		return layerData.res.features.length;
	}

	// Na základě konfigurčního souboru získáme toužené hodnoty z nafetchovaných dat (z geojson features)
	const arrayOfValues = extractValuesFromLayerData(value);

	// Provedeme matematickou operaci nad hodnotami
	const result = performMathOperation(arrayOfValues, value.mathOperation);

	if (typeof result === "string") {
		return result;
	}
	return formatNumber(result, 1);
}

function extractValuesFromLayerData(value: ValueDefinition): any[] {
	// Pokud je value.attributePath string, znamená to, že se jedná o přímý přístup k hodnotě
	if (typeof value.attributePath === "string") {
		const path = value.attributePath;
		return layerData.res.features.map((feature: any) => {
			return resolvePath(feature.properties, path);
		});
	}

	// Pokud je value.attributePath objekt, znamená to, že se jedná o složitější operaci

	const attributePath = value.attributePath as {
		arrayPath: string;
		where: {path: string; equals: string};
		valuePath: string;
	};
	const pathToAttribute = attributePath.arrayPath;
	const arrayOfValues: any[] = [];

	layerData.res.features.forEach((feature: any) => {
		const arrayOfMeasurements = resolvePath(
			feature.properties,
			pathToAttribute
		);

		arrayOfMeasurements.forEach((measurement: any) => {
			if (matchesCondition(measurement, attributePath.where)) {
				const foundValue = resolvePath(
					measurement,
					attributePath.valuePath
				);
				arrayOfValues.push(foundValue);
			}
		});
	});
	return arrayOfValues;
}

function performMathOperation(
	values: any[],
	operation: "sum" | "average" | "mostCommon"
): number | string {
	const sum = values.reduce((a: any, b: any) => a + b, 0);

	if (operation === "average") {
		return (values.length ? sum / values.length : 0) as number;
	}

	if (operation === "mostCommon") {
		const counts: any = {};
		values.forEach((value) => {
			counts[value] = (counts[value] || 0) + 1;
		});
		const mostCommon = Object.keys(counts).reduce((a, b) =>
			counts[a] > counts[b] ? a : b
		);
		return mostCommon;
	}

	return sum as number;
}

function matchesCondition(
	component: any,
	where: {path: string; equals: string}
): boolean {
	const value = resolvePath(component, where.path);
	return value === where.equals;
}

function resolvePath(object: any, path: string): any {
	const pathArr = path.split(".") || [];
	return pathArr.reduce((acc: any, curr: string) => acc[curr], object);
}

function formatNumber(number: number, decimals: number): string {
	// Then, format the number with space as a thousands separator
	return new Intl.NumberFormat("cs-CZ", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
		// Use ' ' (space) as the thousands separator. Adjust the locale and options as needed.
	}).format(number);
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
					:description="widget.description"
					:graph="handleGraph(widget.graph)"
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
