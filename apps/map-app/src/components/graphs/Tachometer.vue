<script setup lang="ts">
import {calculatePercentage, getColorSchema} from "@/lib/utils";
import {computed, watch, ref} from "vue";

const props = defineProps<{
	graph: {
		value: string;
		minValue?: number;
		maxValue?: number;
		strokeColor?: string;
		unit?: string;
	};
}>();

let {lightColor, darkColor} = getColorSchema(
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
					formatter: function (val: any) {
						if (
							props.graph.minValue !== undefined &&
							props.graph.minValue !== null &&
							props.graph.maxValue !== undefined &&
							props.graph.maxValue !== null &&
							props.graph.unit
						) {
							return props.graph.value + " " + props.graph.unit;
						}
						return props.graph.value;
					},
				},
			},
		},
	},
	fill: {
		type: ["solid"],
		colors: [darkColor],
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
