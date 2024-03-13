<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import Button from "./ui/button/Button.vue";
import {Trash2} from "lucide-vue-next";
import WidgetMedium from "./WidgetMedium.vue";
import WidgetSmall from "./WidgetSmall.vue";
import WidgetLarge from "./WidgetLarge.vue";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.locale("cs");
dayjs.extend(isBetween);

defineEmits(["removeLayer"]);
const {layerData} = defineProps<{
	layerData: {
		pref: any;
		res: any;
	};
}>();

type ValueDefinition = {
	mathOperation:
		| "sum"
		| "average"
		| "countFeatures"
		| "mostCommon"
		| "countUnique";
	attributePath:
		| {
				arrayPath: string;
				where: {
					path: string;
					equals: string;
					pathDay?: string;
					pathTimeOpens?: string;
					pathTimeCloses?: string;
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
	// Pokud je value string nebo number, vrátíme ho bez žádných dalších operací
	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	// Pokud je zapotřebí pouze spočítat počet feature, vrátíme bez dalších operací počet feature
	if (value.mathOperation === "countFeatures") {
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

	const arrayOfValues: any[] = [];

	layerData.res.features.forEach((feature: any) => {
		const arrayOfMeasurements = resolvePath(
			feature.properties,
			attributePath.arrayPath
		);

		arrayOfMeasurements.find((measurement: any) => {
			if (matchesCondition(measurement, attributePath.where)) {
				const foundValue = resolvePath(
					measurement,
					attributePath.valuePath
				);
				arrayOfValues.push(foundValue);
				return true;
			}
			return false;
		});
	});
	return arrayOfValues;
}

function performMathOperation(
	values: any[],
	operation: "sum" | "count" | "average" | "mostCommon" | "countUnique"
): number | string {
	if (operation === "count") {
		return values.length;
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

	if (operation === "countUnique") {
		return new Set(values).size;
	}

	const sum = values.reduce((a: any, b: any) => a + b, 0);

	if (operation === "average") {
		return (values.length ? sum / values.length : 0) as number;
	}

	return sum as number;
}

function matchesCondition(
	component: any,
	where: {
		path: string;
		equals: string;
		pathDay?: string;
		pathTimeOpens?: string;
		pathTimeCloses?: string;
	}
): boolean {
	const value = resolvePath(component, where.path);

	// Kontrole, zda dnes otevřeno
	if (where.equals === "OPEN_TODAY" && value === dayjs().format("dddd")) {
		return true;
	}

	// Kontrole, zda nyní otevřeno
	if (
		where.equals === "OPEN_NOW" &&
		where.pathDay &&
		where.pathTimeOpens &&
		where.pathTimeCloses
	) {
		const day = resolvePath(component, where.pathDay);
		const now = dayjs();

		if (day !== now.format("dddd")) {
			return false;
		}

		const opens = resolvePath(component, where.pathTimeOpens);
		const closes = resolvePath(component, where.pathTimeCloses);

		const opensTime = dayjs(now.format("YYYY.MM.DD") + " " + opens);
		const closesTime = dayjs(now.format("YYYY.MM.DD") + " " + closes);

		return now.isBetween(opensTime, closesTime);
	}

	// where.equals nemá speciální (dynamickou / časovou) hodnotu, takže se porovnává přímo.
	return value === where.equals;
}

function resolvePath(object: any, path: string): any {
	if (!path) return object;
	const pathArr = path.split(".") || [];
	return pathArr.reduce((acc: any, curr: string) => acc[curr], object);
}

function formatNumber(number: number, decimals: number): string {
	return new Intl.NumberFormat("cs-CZ", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
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
