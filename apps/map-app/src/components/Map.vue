<script setup lang="ts">
import {h, nextTick, onMounted, render} from "vue";
import Popup from "./Popup.vue";
import "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const L = window["L"];

onMounted(async () => {
	const myMap = L.map("viewDiv", {
		center: [50.075, 14.46],
		zoom: 12,
		zoomControl: true,
	});

	// BASE LAYER
	L.tileLayer(
		"https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJ1bTA5IiwiYSI6ImNsbnlubHdiZjBvbTQybHFrOG52emN0aGEifQ.nU4crnexBhRyteEeIpBpgQ",
		{
			attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
		}
	).addTo(myMap);

	// MARKER
	const cluster = L.markerClusterGroup();
	myMap.addLayer(cluster);

	const markerOptions = {
		icon: L.icon({
			iconUrl: "marker-municipality.png",
			iconSize: [30, 30], // size of the icon
			iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
		}),
	};

	const myHeaders = new Headers();
	myHeaders.append(
		"X-Access-Token",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjE5NiwiaWF0IjoxNjk3ODE5MjgzLCJleHAiOjExNjk3ODE5MjgzLCJpc3MiOiJnb2xlbWlvIiwianRpIjoiYjZlZjk2OWEtNjhiOC00ODczLWI0N2ItZWU1YTBkZjZlNzQzIn0.ySlUXcYOjJV87LtZrjeqSSjIy18h2jb9iXtOD9gRf-c"
	);

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
		redirect: "follow",
	};

	const res = await fetch(
		"https://api.golemio.cz/v2/municipalauthorities/",
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => {
			return JSON.parse(result);
		})
		.catch((error) => console.error(error));

	res.features.forEach((feature) => {
		const {geometry, properties} = feature;
		const {coordinates} = geometry;
		const [lng, lat] = coordinates;

		const popup = L.popup({
			className: "custom-popup",
			minWidth: 480,
			content: `<div id="map-popup-${properties.id}" />`,
			pane: "popupPane",
			closeButton: false,
		});

		L.marker([lat, lng], markerOptions)
			.addTo(cluster)
			.bindPopup(popup)
			.on("click", (e) => {
				render(
					h(Popup, {properties}, null),
					document.getElementById(`map-popup-${properties.id}`)!
				);
			});
	});
});
</script>

<template>
	<div class="w-full h-full">
		<div id="viewDiv" class="outline-0 w-full h-full" />
		<div
			id="layersButton"
			class="w-[100px] h-[100px] bg-foreground rounded-[var(--gap)]"
		/>
		<div id="zoomGroup" class="grid gap-[7px]">
			<div
				class="w-8 h-8 bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomin"
			>
				+
			</div>
			<div
				class="w-8 h-8 bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomout"
			>
				-
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
</style>
