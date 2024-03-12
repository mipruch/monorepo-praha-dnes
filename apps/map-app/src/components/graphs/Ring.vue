<script setup lang="ts">
import {computed} from "vue";
import {calculatePercentage} from "@/lib/utils";

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
