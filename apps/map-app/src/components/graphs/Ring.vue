<script setup lang="ts">
import {computed} from "vue";
import {calculatePercentage, getColorSchema} from "@/lib/utils";

const props = defineProps<{
	graph: {
		value: string;
		minValue?: number;
		maxValue?: number;
		strokeColor?: string;
	};
}>();

const {darkColor, lightColor} = getColorSchema(
	props.graph.strokeColor,
	props.graph.value
);

const percentage = computed(() => {
	return calculatePercentage(
		Number.parseFloat(props.graph.value),
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
				background: lightColor,
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
		colors: [darkColor],
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
