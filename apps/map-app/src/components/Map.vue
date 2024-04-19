<script setup lang="ts">
import {pragueMap} from "../stores/mapStore";
import {onMounted, ref, watch, type Ref} from "vue";
import {Layers} from "lucide-vue-next";

const layersButton: Ref<HTMLDivElement | null> = ref(null);
const zoomInButton: Ref<HTMLDivElement | null> = ref(null);
const zoomOutButton: Ref<HTMLDivElement | null> = ref(null);
const darkMode = ref(false);

onMounted(() => {
	pragueMap.initializeMap("viewDiv");
	darkMode.value = document.documentElement.classList.contains("dark");

	layersButton.value?.addEventListener("click", () => {
		if (document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.remove("dark");
			pragueMap.setLightMode();
			darkMode.value = false;
		} else {
			document.documentElement.classList.add("dark");
			pragueMap.setDarkMode();
			darkMode.value = true;
		}
	});

	zoomInButton.value?.addEventListener("click", () => {
		const currentZoom = pragueMap.map.getZoom();
		const maxZoom = pragueMap.maxZoom;
		if (currentZoom >= maxZoom) return;
		pragueMap.map.flyTo(pragueMap.map.getCenter(), currentZoom + 1);
	});

	zoomOutButton.value?.addEventListener("click", () => {
		const currentZoom = pragueMap.map.getZoom();
		if (currentZoom <= 0) return;
		pragueMap.map.flyTo(pragueMap.map.getCenter(), currentZoom - 1);
	});
});
</script>

<template>
	<div class="w-full h-full relative">
		<div id="viewDiv" class="w-full h-full absolute top-0 left-0" />
		<div
			ref="layersButton"
			id="layersButton"
			class="z-[9999] absolute bottom-0 m-[--gap] w-[75px] h-[75px] bg-foreground rounded-[var(--gap)] cursor-pointer grid items-center justify-center hover:opacity-75 transition-all duration-100 ease-in-out select-none"
		>
			<Layers :color="darkMode ? 'black' : 'white'" :size="28" />
		</div>
		<div
			id="zoomGroup"
			class="grid items-end h-min gap-[7px] z-[9999] absolute bottom-0 right-0 m-[--gap]"
		>
			<div
				class="w-8 h-8 bg-foreground leading-none rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomin"
				ref="zoomInButton"
			>
				<span class="translate-y-[-2px]"> + </span>
			</div>
			<div
				class="w-8 h-8 leading-none bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomout"
				ref="zoomOutButton"
			>
				<span class="translate-y-[-2px]"> - </span>
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
	@apply bg-green dark:text-black;
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
