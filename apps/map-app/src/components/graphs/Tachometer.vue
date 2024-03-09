<script setup lang="ts">
import {calculatePercentage} from "@/lib/utils";
import {computed} from "vue";
const props = defineProps<{
	graph: {
		value: number;
		minValue?: number;
		maxValue?: number;
		strokeColor?: string;
		unit?: string;
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
	states: "none",
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
			startAngle: -130,
			endAngle: 130,
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
					formatter: function (val: any) {
						if (
							props.graph.minValue &&
							props.graph.maxValue &&
							props.graph.unit
						)
							return props.graph.value + " " + props.graph.unit;
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
	stroke: {
		lineCap: "round",
	},
};
</script>

<template>
	<div>
		<p class="text-sm opacity-50 absolute bottom-1 left-7">
			{{ props.graph.minValue }} {{ props.graph.unit }}
		</p>
		<p class="text-sm opacity-50 absolute bottom-1 right-3 text-right">
			{{ props.graph.maxValue }} {{ props.graph.unit }}
		</p>
		<apexchart
			:options="options"
			:series="[percentage]"
			width="135%"
			class="absolute left-[-35%] top-[-14%]"
		/>
	</div>
</template>
