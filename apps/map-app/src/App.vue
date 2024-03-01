<script setup lang="ts">
import Tag from "./components/Tag.vue";
import Tags from "./components/Tags.vue";
import Button from "./components/Button.vue";
import Map from "./components/Map.vue";
import Popup from "./components/Popup.vue";
import {Plus} from "lucide-vue-next";
// import mapa from "~/map";
// import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";
// import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

// const click = async () => {
// 	const geojson = await useGolemioFetch("municipalauthorities/");
// 	console.log(geojson);

// 	const blob = new Blob([JSON.stringify(geojson)], {
// 		type: "application/json",
// 	});

// 	// URL reference to the blob
// 	const url = URL.createObjectURL(blob);

// 	const clusterConfig = {
// 		type: "cluster",
// 		clusterRadius: "100px",
// 		// {cluster_count} is an aggregate field containing
// 		// the number of features comprised by the cluster
// 		popupTemplate: {
// 			title: "Skupina bodů",
// 			content: "Tato skupina bodů obsahuje {cluster_count} úřadů.",
// 			fieldInfos: [
// 				{
// 					fieldName: "cluster_count",
// 					format: {
// 						places: 0,
// 						digitSeparator: true,
// 					},
// 				},
// 			],
// 		},
// 		// clusterMinSize: "24px",
// 		// clusterMaxSize: "40px",
// 		clusterSize: "24px",
// 		labelingInfo: [
// 			{
// 				deconflictionStrategy: "none",
// 				labelExpressionInfo: {
// 					expression: "Text($feature.cluster_count, '#,###')",
// 				},
// 				symbol: {
// 					type: "text",
// 					color: "#004a5d",
// 					font: {
// 						weight: "bold",
// 						family: "Noto Sans",
// 						size: "17px",
// 					},
// 				},
// 				labelPlacement: "center-center",
// 			},
// 		],
// 	};

// 	const layer = new GeoJSONLayer({
// 		url: url,
// 		title: "Municipal Authorities",
// 		// Use customParameters to set the query parameters
// 		// get the all red alert level earthquakes in Japan since 1905 as geojson
// 		featureReduction: clusterConfig,
// 		fields: [
// 			{
// 				name: "id",
// 				alias: "ID",
// 				type: "string",
// 			},
// 			{
// 				name: "name",
// 				alias: "Název",
// 				type: "string",
// 			},
// 			{
// 				name: "district",
// 				alias: "Městská část",
// 				type: "string",
// 			},
// 			{
// 				name: "updated_at",
// 				alias: "Aktualizováno",
// 				type: "date",
// 			},
// 			{
// 				name: "email",
// 				alias: "Email",
// 				type: "blob",
// 			},
// 			{
// 				name: "opening_hours",
// 				alias: "Otevírací doba",
// 				type: "blob",
// 			},
// 		],
// 		objectIdField: "id",

// 		popupTemplate: {
// 			title: "{name}",
// 			// content: [
// 			// 	"Aktualizováno: {updated_at}",
// 			// 	"Městská část: {district}",
// 			// ],
// 			content:
// 				"<p>Aktualizováno: {updated_at}</p><p>Městská část: {district}</p><p>ID: {id}</p><p>Název: {name}</p><p>Email: {email}</p><p>Otevírací doba: {opening_hours.day_of_week}</p>",
// 		},
// 		renderer: {
// 			type: "simple",
// 			field: "id",
// 			symbol: {
// 				type: "simple-marker",
// 				size: "15px",
// 				color: "#00FF00",
// 				outline: {
// 					color: "rgba(0, 139, 174, 0)",
// 					width: 0,
// 				},
// 			},
// 		},
// 	});

// 	let imageryLayer = new ImageryLayer({
// 		// URL to the imagery service
// 		url: "https://gs-pub.praha.eu/imgs/rest/services/ort/letecke_snimkovani/ImageServer",
// 	});

// 	mapa.add(layer);
// };
</script>

<template>
	<div
		class="grid grid-cols-2 gap-[var(--gap)] p-[var(--gap)] h-screen w-screen relative bg-black"
	>
		<Map class="bg-background rounded-[var(--gap)] overflow-hidden" />

		<div class="bg-background rounded-[var(--gap)] p-7">
			<Button @click="console.log('click')">
				<Plus class="mr-2" />
				Přidat vrstvu
			</Button>
			<div class="text-orange text-3xl"></div>
			<h1 class="">Officia ut elit esse officia sint culpa eu commodo</h1>
			<h2>Officia ut elit esse officia sint culpa eu commodo</h2>
			<h3>Officia ut elit esse officia sint culpa eu commodo</h3>
			<h4>Officia ut elit esse officia sint culpa eu commodo</h4>
			<h5>Officia ut elit esse officia sint culpa eu commodo</h5>
			<h6>Officia ut elit esse officia sint culpa eu commodo</h6>
			<p>Officia ut elit esse officia sint culpa eu commodo</p>

			<Tags big v-slot="slotProps">
				<Tag color="green" text="Hello World" :big="slotProps.big" />
				<Tag color="green" text="Hello World" :big="slotProps.big" />
			</Tags>
		</div>
	</div>
</template>
