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
import {getNestedProperty} from "@/stores/mapperUtilities";
dayjs.locale("cs");
dayjs.extend(isBetween);

defineEmits(["removeLayer"]);
const {layerData} = defineProps<{
	layerData: {
		pref: any;
		res: {
			features: any[];
		};
	};
}>();

type ValueDefinition = {
	mathOperation:
		| "sum"
		| "average"
		| "countFeatures"
		| "mostCommon"
		| "proportion"
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

type ProportionDefinition = {
	mathOperation: "proportion";
	value1: string | number | ValueDefinition;
	value2: string | number | ValueDefinition;
};

function handleGraph(graph: any): any {
	if (graph.type === "List") {
		graph.items = handleList(graph);
		return graph;
	}
	graph.value = handleValue(graph.value);
	return graph;
}

function handleValue(
	value: string | number | ValueDefinition | ProportionDefinition
): string | number {
	// Pokud je value string nebo number, vrátíme ho bez žádných dalších operací
	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	// Pokud je zapotřebí pouze spočítat počet feature, vrátíme bez dalších operací počet feature
	if (value.mathOperation === "countFeatures") {
		return layerData.res.features.length;
	}

	if (value.mathOperation === "proportion") {
		const number1 = handleValue((value as ProportionDefinition).value1);
		const number2 = handleValue((value as ProportionDefinition).value2);

		if (typeof number1 === "string" || typeof number2 === "string") {
			return "N/A";
		}
		return (number1 / number2) * 100;
	}

	// Na základě konfigurčního souboru získáme toužené hodnoty z nafetchovaných dat (z geojson features)
	const arrayOfValues = extractValuesFromLayerData(value);

	// Provedeme matematickou operaci nad hodnotami
	const result = performMathOperation(arrayOfValues, value.mathOperation);

	if (typeof result === "string") {
		return result;
	}
	return result;
}

function handleList(graph: any): any {
	const sortMethod = graph.sortMethod;

	// Odfiltrovat features, které nemají požadovanou hodnotu
	const features = layerData.res.features.filter((feature: any) => {
		if (
			getNestedProperty(feature.properties, graph.sortBy) !== undefined &&
			getNestedProperty(feature.properties, graph.sortBy) !== null
		) {
			return true;
		}
	});

	// Seřadit features podle požadované hodnoty sortBy a sortMethod
	const sorted = features.sort((a: any, b: any) => {
		const valueA = getNestedProperty(a.properties, graph.sortBy);
		const valueB = getNestedProperty(b.properties, graph.sortBy);
		if (sortMethod === "asc") {
			return valueA - valueB;
		} else if (sortMethod === "desc") {
			return valueB - valueA;
		}
		return 0;
	});

	// Vytvořit pole stringů, které budou zobrazeny v listu
	const items = sorted.map(
		(feature: any) =>
			getNestedProperty(feature.properties, graph.textPath) +
			", " +
			getNestedProperty(feature.properties, graph.sortBy)
	);
	return items;
}

function extractValuesFromLayerData(value: ValueDefinition): any[] {
	// Pokud je value.attributePath string, znamená to, že se jedná o přímý přístup k hodnotě
	if (typeof value.attributePath === "string") {
		const path = value.attributePath;
		return layerData.res.features.map((feature: any) => {
			return getNestedProperty(feature.properties, path);
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
		let arrayOfMeasurements = getNestedProperty(
			feature.properties,
			attributePath.arrayPath
		);

		if (!Array.isArray(arrayOfMeasurements)) {
			arrayOfMeasurements = [arrayOfMeasurements];
		}

		arrayOfMeasurements.find((measurement: any) => {
			if (matchesCondition(measurement, attributePath.where)) {
				const foundValue = getNestedProperty(
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
	operation:
		| "sum"
		| "count"
		| "average"
		| "mostCommon"
		| "countUnique"
		| "proportion"
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
	const value = getNestedProperty(component, where.path);

	// Kontrola, zda je dnes otevřeno
	if (where.equals === "OPEN_TODAY" && value === dayjs().format("dddd")) {
		return true;
	}

	// Kontrola, zda je nyní otevřeno
	if (
		where.equals === "OPEN_NOW" &&
		where.pathDay &&
		where.pathTimeOpens &&
		where.pathTimeCloses
	) {
		const day = getNestedProperty(component, where.pathDay);
		const now = dayjs();

		if (day !== now.format("dddd")) {
			return false;
		}

		const opens = getNestedProperty(component, where.pathTimeOpens);
		const closes = getNestedProperty(component, where.pathTimeCloses);

		const opensTime = dayjs(now.format("YYYY.MM.DD") + " " + opens);
		const closesTime = dayjs(now.format("YYYY.MM.DD") + " " + closes);

		return now.isBetween(opensTime, closesTime);
	}

	if (where.equals === "NOTNULL") {
		return value !== null && value !== undefined;
	}

	// where.equals nemá speciální (dynamickou / časovou) hodnotu, takže se porovnává přímo.
	return value === where.equals;
}

function formatNumber(number: number, decimals: number): string | number {
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
					:graph="handleGraph(widget.graph)"
				/>
			</div>
		</div>
	</div>
</template>
