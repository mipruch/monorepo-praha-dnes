<script setup lang="ts">
import {computed, ref, type Ref} from "vue";
import {getColorSchema} from "@/lib/utils";

const props = defineProps<{
	graph: {
		value: string;
		minValue?: number;
		maxValue?: number;
		strokeColor?: string;
		unit?: string;
	};
}>();

let {darkColor} = getColorSchema(props.graph.strokeColor, props.graph.value);

function calculateLeft(
	currentValue: number,
	minValue: number | undefined,
	maxValue: number | undefined
) {
	const minLeft = -5; // Pixelová hodnota pro minimální hodnotu
	const maxLeft = 258; // Pixelová hodnota pro maximální hodnotu

	if (minValue == undefined || maxValue == undefined) {
		minValue = 0;
		maxValue = 100;
	}

	// Kontrola, zda hodnoty splňují očekávané podmínky
	if (minValue >= maxValue) {
		throw new Error(
			"Minimální hodnota musí být menší než maximální hodnota."
		);
	}

	// Kontrola hraničních hodnot
	if (currentValue < minValue) return minLeft + "px";
	if (currentValue > maxValue) return maxLeft + "px";

	// Vypočet procentuální pozice aktuální hodnoty mezi minimální a maximální hodnotou
	const percentage = (currentValue - minValue) / (maxValue - minValue);

	// Vypočet odpovídající pixelové hodnoty pro vypočtené procento
	const left = (maxLeft - minLeft) * percentage + minLeft;

	return left + "px";
}

// Použití funkce
const left = computed(() => {
	return calculateLeft(
		Number.parseFloat(props.graph.value),
		props.graph.minValue,
		props.graph.maxValue
	);
});
</script>

<template>
	<div
		class="line h-[9px] w-full rounded-[5px] relative"
		:style="`background:${darkColor}`"
	>
		<p class="text-sm absolute opacity-50 top-4">
			{{ props.graph.minValue }} {{ props.graph.unit }}
		</p>
		<p class="text-sm absolute opacity-50 top-4 right-0 text-right">
			{{ props.graph.maxValue }} {{ props.graph.unit }}
		</p>
		<div
			class="dot h-[15px] w-[15px] bg-white rounded-full absolute top-[-3px] transition-all shadow-[0px_0px_10px_rgba(0,0,0,0.25)]"
			:style="{left}"
		/>
	</div>
</template>
