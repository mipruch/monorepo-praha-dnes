<script setup lang="ts">
import {ref} from "vue";
const props = defineProps<{
	graph: any;
}>();

function dataPointSelection(event: any, chartContext: any, config: any) {
	// ...
	updatePastValue(config.dataPointIndex);
}

const pastValue = ref({
	show: false,
	value: props.graph.series[0].data,
	category: "",
});

function updatePastValue(index: number) {
	pastValue.value.show = true;
	pastValue.value.value = props.graph.series[0].data[index];
	if (!props.graph.xcategories) {
		pastValue.value.category = "" + (index + 1);
		return;
	}
	pastValue.value.category = props.graph.xcategories[index];
}

const chartOptions = {
	chart: {
		toolbar: {
			show: false,
		},
		type: "bar",

		zoom: {
			enabled: false,
		},
	},
	plotOptions: {
		bar: {
			borderRadius: 3,
		},
	},
	tooltip: {
		enabled: false,
	},
	dataLabels: {
		enabled: false,
	},
	grid: {
		show: false,
	},
	xaxis: {
		categories: props.graph.xcategories || [],
		axisTicks: {
			show: false,
		},
		axisBorder: {
			show: false,
		},
		labels: {
			style: {
				colors: "#888",
				fontFamily: "system-ui",
			},
		},
	},
	yaxis: {
		stepSize: 50,
		labels: {
			show: true,
			style: {
				colors: "#888",
				fontFamily: "system-ui",
			},
			formatter: function (value: any) {
				return value + " " + (props.graph.unit || "");
			},
		},
	},
	stroke: {
		type: "none",
	},
	fill: {
		type: "solid",
		colors: ["#D9D9D9"],
	},
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
};
</script>

<template>
	<div class="grid grid-rows-[auto_1fr] w-full">
		<div>
			<div id="statistics">
				<p class="before:bg-blue-light">
					Aktuální hodnota je
					{{
						props.graph.series[0].data.slice(-1)[0] +
						(props.graph.unit ? " " + props.graph.unit : "")
					}}.
				</p>
				<p class="before:bg-blue" v-show="pastValue.show">
					Hodnota pro {{ pastValue.category }} je
					{{ pastValue.value }}.
				</p>
			</div>
		</div>
		<div class="h-full">
			<apexchart
				:options="chartOptions"
				:series="props.graph.series"
				height="100%"
				width="100%"
				class="h-full -ml-4"
				@dataPointSelection="dataPointSelection"
			/>
		</div>
	</div>
</template>

<style>
.apexcharts-bar-series path:hover {
	fill: #b4d2ff !important;
	cursor: pointer;
}

.apexcharts-bar-series path:last-of-type {
	fill: #b4d2ff !important;
}

.apexcharts-bar-series path[selected="true"] {
	fill: #0066ff !important;
}

.barchart-dot {
	position: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #0066ff;
}

#statistics p::before {
	content: " ";
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 5px;
	transform: translateY(-1px);
}
</style>
