<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
	graph: {
		value: number;
		minValue?: number;
		maxValue?: number;
		strokeColor?: string;
	};
}>();

if (props.graph.strokeColor == undefined) {
	props.graph.strokeColor = "#0066FF";
}

function calculatePercentage(
	currentValue: number,
	minValue: number | undefined,
	maxValue: number | undefined
) {
	const minGraph = 0; //  Minimální hodnota grafu
	const maxGraph = 100; // Maximální hodnota grafu

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
	if (currentValue < minValue) return minGraph;
	if (currentValue > maxValue) return maxGraph;

	// Vypočet procentuální pozice aktuální hodnoty mezi minimální a maximální hodnotou
	const percentage = (currentValue - minValue) / (maxValue - minValue);

	// Vypočet odpovídající pixelové hodnoty pro vypočtené procento
	const left = (maxGraph - minGraph) * percentage + minGraph;

	return left;
}

const percentage = computed(() => {
	return calculatePercentage(
		props.graph.value,
		props.graph.minValue,
		props.graph.maxValue
	);
});

const options = {
	states: {
		hover: {
			filter: {
				type: "none",
			},
		},
		active: {
			filter: {
				type: "none",
			},
		},
	},
	chart: {
		type: "radialBar",
		animations: {
			enabled: true,
			easing: "easeinout",
			dynamicAnimation: {
				enabled: true,
				speed: 350,
			},
		},
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "60%",
			},
			track: {
				show: true,
				background: "#B4D2FF",
			},
			dataLabels: {
				name: {
					show: false,
				},
				value: {
					color: "black",
					fontSize: "30px",
					fontFamily: "system-ui",
					fontWeight: "600",
					offsetY: 11,
					show: true,
					formatter: function (val: any) {
						return props.graph.value + " %";
					},
				},
			},
		},
	},
	fill: {
		type: ["solid"],
		colors: ["#0066FF"],
	},
};
</script>

<template>
	<apexchart
		:options="options"
		:series="[percentage]"
		width="135%"
		class="absolute left-[-35%]"
	/>
</template>
