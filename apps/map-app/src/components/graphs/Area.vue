<script setup lang="ts">
const props = defineProps<{
	graph: any;
}>();

const chartOptions = {
	chart: {
		toolbar: {
			show: false,
		},
		type: "area",

		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	grid: {
		show: false,
	},
	xaxis: {
		categories: props.graph.xcategories,
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
		lables: {
			show: false,
		},
		show: false,
	},
	stroke: {
		curve: "smooth",
		width: 1,
		colors: ["#0066FF"],
	},
	fill: {
		type: "gradient",
		gradient: {
			opacityFrom: 0.6,
			opacityTo: 0,
			stops: [10, 100],
		},
	},
};
</script>

<template>
	<apexchart
		:height="props.graph.size === 'small' ? 120 : 200"
		width="105%"
		:options="chartOptions"
		:series="props.graph.series"
		class="-mt-4 ml-[-2%]"
	/>
</template>
