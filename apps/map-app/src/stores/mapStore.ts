import {h, onMounted, render} from "vue";
import Popup from "../components/Popup.vue";
import "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {reactive} from "vue";
import geojson from "../assets/geojson.json";

const L = window["L"];

class PragueMap {
	private static instance: PragueMap;
	public map!: L.Map;

	constructor() {}

	private lightBase = L.tileLayer(
		"https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJ1bTA5IiwiYSI6ImNsbnlubHdiZjBvbTQybHFrOG52emN0aGEifQ.nU4crnexBhRyteEeIpBpgQ",
		{
			attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
		}
	);

	private darkBase = L.tileLayer(
		"https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJ1bTA5IiwiYSI6ImNsbnlubHdiZjBvbTQybHFrOG52emN0aGEifQ.nU4crnexBhRyteEeIpBpgQ",
		{
			attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
		}
	);

	public cluster = L.markerClusterGroup({
		showCoverageOnHover: false,
		iconCreateFunction(cluster) {
			return L.divIcon({
				html: `<div class='marker-cluster'>${cluster.getChildCount()}</div>`,
			});
		},
	});

	private markerOptions = {
		icon: L.icon({
			iconUrl: "marker-municipality.png",
			iconSize: [30, 30], // size of the icon
			iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
		}),
	};

	public initializeMap(containerId: string) {
		this.map = L.map("viewDiv", {
			center: [50.075, 14.46],
			zoom: 12,
			zoomControl: false,
			layers: [this.lightBase],
			attributionControl: false,
			zoomAnimation: true,
		});
		this.cluster.addTo(this.map);

		// LAYERS BUTTON
		document
			.getElementById("layersButton")
			?.addEventListener("click", () => {
				if (this.map.hasLayer(this.lightBase)) {
					this.map.removeLayer(this.lightBase);
					this.map.addLayer(this.darkBase);
				} else {
					this.map.removeLayer(this.darkBase);
					this.map.addLayer(this.lightBase);
				}
			});
		// ZOOM BUTTONS
		document.getElementById("zoomin")?.addEventListener("click", () => {
			this.map.flyTo(this.map.getCenter(), this.map.getZoom() + 1);
		});
		document.getElementById("zoomout")?.addEventListener("click", () => {
			this.map.flyTo(this.map.getCenter(), this.map.getZoom() - 1);
		});
	}

	public static getInstance(): PragueMap {
		if (!PragueMap.instance) {
			PragueMap.instance = new PragueMap();
		}
		return PragueMap.instance;
	}

	private layersData = {
		layers: [] as {name: string; collection: L.Layer}[],
	};

	public get layers() {
		return this.layersData.layers;
	}

	public async addLayer(name: string) {
		if (this.layersData.layers.find((layer) => layer.name === name)) {
			return;
		}
		const collection = await makeCluster2();
		this.layersData.layers.push({name: name, collection: collection});
		collection.addTo(this.cluster);
	}

	public removeLayer(name: string) {
		const layer = this.layersData.layers.find(
			(layer) => layer.name === name
		);
		if (!layer) return;
		this.cluster.removeLayer(layer?.collection);
		this.layersData.layers = this.layersData.layers.filter(
			(layer) => layer.name !== name
		);
	}
}
export const pragueMap = PragueMap.getInstance();

async function makeCluster2() {
	// FETCH DATA
	const myHeaders = new Headers();
	myHeaders.append(
		"X-Access-Token",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjE5NiwiaWF0IjoxNjk3ODE5MjgzLCJleHAiOjExNjk3ODE5MjgzLCJpc3MiOiJnb2xlbWlvIiwianRpIjoiYjZlZjk2OWEtNjhiOC00ODczLWI0N2ItZWU1YTBkZjZlNzQzIn0.ySlUXcYOjJV87LtZrjeqSSjIy18h2jb9iXtOD9gRf-c"
	);

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
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

	const color = "#FF5AFF";
	const json = new L.GeoJSON(res, {
		style: {
			color: color,
			weight: 2,
			opacity: 1,
			fillColor: color,
			fillOpacity: 0.5,
		},

		pointToLayer: function (geoJsonPoint, latlng) {
			return L.marker(latlng, {
				icon: L.divIcon({
					html: `<div class='deflate-icon' style='background-color:${color}'><img src="home.svg"></div>`,
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
						h(
							Popup,
							{properties: feature.properties, color: color},
							null
						),
						document.getElementById(
							`map-popup-${feature.properties.name}`
						)!
					);
				});
			}
		},
	});
	// const cluster = L.markerClusterGroup({
	//     showCoverageOnHover: false,
	//     spiderfyOnMaxZoom: true,
	//     iconCreateFunction(cluster) {
	//         return L.divIcon({
	//             html: `<div class='marker-cluster'>${cluster.getChildCount()}</div>`,
	//         });
	//     },
	// });

	// const deflated = L.deflate({
	// 	minSize: 100,
	// 	markerLayer: pragueMap.cluster,
	// 	markerOptions: {
	// 		icon: L.divIcon({
	// 			html: `<div class='deflate-icon' style='background-color:${color}'><img src="home.svg"></div>`,
	// 			iconSize: [30, 30], // size of the icon
	// 			iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
	// 			popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
	// 		}),
	// 	},
	// });

	// json.addTo(deflated);

	return json;
}
