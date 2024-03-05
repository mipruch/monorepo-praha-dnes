<script setup lang="ts">
import {pragueMap} from "../stores/mapStore";
import {onMounted} from "vue";
import {Layers} from "lucide-vue-next";

onMounted(() => {
	pragueMap.initializeMap("viewDiv");
});
</script>

<template>
	<div class="w-full h-full relative">
		<div id="viewDiv" class="w-full h-full absolute top-0 left-0" />
		<div
			class="map-controls z-[9999] absolute bottom-0 flex justify-between w-full p-[--gap] items-end"
		>
			<div
				id="layersButton"
				class="w-[100px] h-[100px] bg-foreground rounded-[var(--gap)] cursor-pointer grid items-center justify-center hover:opacity-75 transition-all duration-100 ease-in-out select-none"
			>
				<Layers color="white" size="36" />
			</div>
			<div id="zoomGroup" class="grid items-end h-min gap-[7px]">
				<div
					class="w-8 h-8 bg-foreground leading-none rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
					id="zoomin"
				>
					+
				</div>
				<div
					class="w-8 h-8 leading-none bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
					id="zoomout"
				>
					-
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.custom-popup {
	.leaflet-popup-content-wrapper {
		// @apply bg-grey-200 rounded-xl;
		padding: 0;
		border: none;
		box-shadow: none;
		background: none;

		.leaflet-popup-content {
			max-width: 480px;
		}
	}
	.leaflet-popup-tip-container {
		display: none;
	}
}

// Cluster icon

.leaflet-div-icon {
	background: none;
	border: none;
}

.marker-cluster {
	display: grid;
	place-items: center;
	justify-content: center;
	width: 26px;
	height: 26px;
	border-radius: 5px;
	@apply bg-green;
}

.marker-icon {
	display: grid;
	place-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	img {
		// transform: translateY(-1px);
		height: 17px;
	}
}

// Zoom controls
.leaflet-control-zoom {
	background: none;
	border: none;
	display: grid;
	gap: 7px;
}
.leaflet-touch,
.leaflet-bar {
	background: none !important;
	border: none !important;
}
</style>
