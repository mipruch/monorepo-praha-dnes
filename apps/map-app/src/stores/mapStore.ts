import {h, reactive, render} from "vue";
import Popup from "../components/Popup.vue";
import "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type {Layer} from "@/types";

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

	public setLightMode() {
		this.map.removeLayer(this.darkBase);
		this.map.addLayer(this.lightBase);
	}

	public setDarkMode() {
		this.map.removeLayer(this.lightBase);
		this.map.addLayer(this.darkBase);
	}

	public maxZoom = 18;

	public initializeMap(containerId: string) {
		this.map = L.map("viewDiv", {
			center: [50.075, 14.46],
			zoom: 12,
			maxZoom: this.maxZoom,
			zoomControl: false,
			layers: [this.lightBase],
			attributionControl: false,
			zoomAnimation: true,
		});
		this.cluster.addTo(this.map);
	}

	public static getInstance(): PragueMap {
		if (!PragueMap.instance) {
			PragueMap.instance = new PragueMap();
		}
		return PragueMap.instance;
	}

	private layers: {id: string; collection: L.Layer}[] = [];

	public activeLayers: Map<
		string,
		{
			pref: any;
			res: any;
		}
	> = reactive(new Map());

	public async addLayer(pref: Layer, id: string) {
		if (!pref) {
			console.error("Chyba při načítání vrstvy.");
			return null;
		}
		if (this.layers.find((layer) => layer.id === id)) {
			console.error(`Vrstva s id ${id} již byla přidána.`);
			return null;
		}

		const [collection, res] = await makeLayer(pref);
		if (!collection || !res) {
			console.error("Chyba při načítání dat.");
			return null;
		}
		this.layers.push({id: id, collection: collection});
		this.activeLayers.set(id, {
			pref,
			res,
		});
		collection.addTo(this.cluster);
		return true;
	}

	public removeLayer(id: string) {
		const layer = this.layers.find((layer) => layer.id === id);
		if (!layer) return;
		this.cluster.removeLayer(layer?.collection);
		this.layers = this.layers.filter((layer) => layer.id !== id);
		this.activeLayers.delete(id);
	}
}
export const pragueMap = PragueMap.getInstance();

async function makeLayer(pref: any) {
	const {res, error} = await fetchData(pref.fetchUrl, pref.headers);
	if (error) {
		console.error(error);
		return [null, null];
	}

	const color = pref.color;
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
					html: `<div class='marker-icon' style='background-color:${color}'><img src="${pref.iconUrl}" alt="mapová značka" width="30px" height="30px" /></div>`,
					iconSize: [30, 30], // size of the icon
					iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
					popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor)
				}),
			});
		},

		onEachFeature: (feature, layer) => {
			if (feature.properties) {
				const id = Math.random();
				const popup = L.popup({
					className: "custom-popup",
					minWidth: 480,
					content: `<div id="map-popup-${id}" />`,
					pane: "popupPane",
					closeButton: false,
				});
				layer.bindPopup(popup);

				layer.on("click", (e) => {
					render(
						h(
							Popup,
							{
								featureProperties: feature.properties,
								layerConfig: pref,
							} as any,
							undefined
						),
						document.getElementById(`map-popup-${id}`)!
					);
				});
				layer.on("keypress", (e) => {
					if (e.originalEvent.key === "Enter") {
						render(
							h(
								Popup,
								{
									featureProperties: feature.properties,
									layerConfig: pref,
								} as any,
								undefined
							),
							document.getElementById(`map-popup-${id}`)!
						);
					}
				});
			}
		},
	});

	return [json, res];
}

async function fetchData(url: string, headers?: {[key: string]: string}) {
	const myHeaders = new Headers();
	Object.entries(headers || {}).forEach(([key, value]) => {
		myHeaders.append(key, value);
	});

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
	};

	let response: {res: any; error: any} = {
		res: null,
		error: null,
	};

	await fetch(url, requestOptions)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.text();
		})
		.then((result) => {
			response.res = JSON.parse(result);
		})
		.catch((error) => {
			response.error = error;
		});

	return response;
}
