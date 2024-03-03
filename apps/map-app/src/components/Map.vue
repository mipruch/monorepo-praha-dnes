<script setup lang="ts">
import {pragueMap} from "../stores/mapStore";
import {h, onMounted, render} from "vue";
import geojson from "../assets/geojson.json";
import L from "leaflet";
import Popup from "./Popup.vue";
import "leaflet.markercluster";
import "Leaflet.Deflate";

var deflated: any;
onMounted(() => {
	pragueMap.initializeMap("viewDiv");

	const color = "#FF0000";
	const json = new L.GeoJSON(geojson, {
		style: {
			color: color,
			weight: 2,
			opacity: 1,
			fillColor: color,
			fillOpacity: 0.5,
		},
		pointToLayer: function (geoJsonPoint, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
					iconUrl: "marker-municipality.png",
					iconSize: [30, 30], // size of the icon
					iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
					popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
				}),
			});
		},
		onEachFeature: (feature, layer) => {
			// does this feature have a property named popupContent?
			if (feature.properties && feature.properties.name) {
				const popup = L.popup({
					className: "custom-popup",
					minWidth: 480,
					content: `<div id="map-popup-${feature.properties.name}" />`,
					pane: "popupPane",
					closeButton: false,
				});
				layer.bindPopup(popup);

				layer.on("click", (e) => {
					render(
						h(Popup, {properties: feature.properties}, null),
						document.getElementById(
							`map-popup-${feature.properties.name}`
						)!
					);
				});
			}
		},
	});
	// const cluster = L.markerClusterGroup({
	// 	showCoverageOnHover: false,
	// 	spiderfyOnMaxZoom: true,
	// 	iconCreateFunction(cluster) {
	// 		return L.divIcon({
	// 			html: `<div class='marker-cluster'>${cluster.getChildCount()}</div>`,
	// 		});
	// 	},
	// });
	deflated = L.deflate({
		minSize: 100,
		markerLayer: pragueMap.cluster,
		markerOptions: {
			icon: L.divIcon({
				html: `<div class='deflate-icon' style='background-color:${color}'><img src="home.svg"></div>`,
				iconSize: [30, 30], // size of the icon
				iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
				popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
			}),
		},
	});
	// json.addTo(deflated);

	// deflated.addTo(pragueMap.map);
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
				class="w-[100px] h-[100px] bg-foreground rounded-[var(--gap)] cursor-pointer"
			/>
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

.deflate-icon {
	display: grid;
	place-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	img {
		transform: translateY(-1px);
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
