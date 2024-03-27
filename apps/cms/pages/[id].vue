<script setup lang="ts">
import Ajv from "ajv";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import {schemas} from "~/schemas/schemas2";
import getSchema from "~/schemas/getSchema";

const route = useRoute();

const config = ref({
	name: "",
	id: "",
	json: "",
});

const valid = ref(false);

async function publish() {
	await fetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/`,
		{
			method: "POST",
			body: config.value.json,
		}
	);
}

const errors = ref<string[]>([]);

onMounted(async () => {
	config.value.json = await fetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${route.params.id}`
	).then((r) => r.text());

	const monaco = await import("monaco-editor");
	self.MonacoEnvironment = {
		getWorker(_, label) {
			if (label === "json") {
				return new jsonWorker();
			}
			if (label === "css" || label === "scss" || label === "less") {
				return new cssWorker();
			}
			if (
				label === "html" ||
				label === "handlebars" ||
				label === "razor"
			) {
				return new htmlWorker();
			}
			if (label === "typescript" || label === "javascript") {
				return new tsWorker();
			}
			return new editorWorker();
		},
	};

	// inicializace editoru
	var modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
	var model = monaco.editor.createModel(config.value.json, "json", modelUri);
	monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
		validate: true,
		schemas: getSchema(modelUri),
	});
	const editor = monaco.editor.create(document.getElementById("container")!, {
		model: model,
		minimap: {
			enabled: false,
		},
	});

	// formátování JSON po načtení editoru
	function formatDocument() {
		editor.getAction("editor.action.formatDocument")!.run();
	}
	editor.onDidChangeModelLanguageConfiguration(formatDocument);
	editor.onDidLayoutChange(formatDocument);

	// validace JSON oproti schématu
	const ajv = new Ajv({schemas: [schemas]});
	const ajvValidate = ajv.getSchema(
		"http://example.com/schemas/baseSchema.json"
	);
	function validateAccordingToSchema(model: any) {
		const markers = monaco.editor.getModelMarkers({resource: model.uri});
		errors.value = [];
		markers.forEach((marker) => {
			errors.value.push(marker.message);
		});
		{
			try {
				if (ajvValidate) {
					ajvValidate(JSON.parse(model.getValue()));
				}
				valid.value = true;
			} catch (e) {
				valid.value = false;
			}
		}
	}
	editor.onDidChangeModelContent(function (e) {
		validateAccordingToSchema(model);
		config.value.json = model.getValue();
		config.value.id = JSON.parse(model.getValue()).id;
		config.value.name = JSON.parse(model.getValue()).name;
	});
});
</script>

<template>
	<div class="grid grid-cols-3 gap-8 splitView">
		<div class="p-12 h-full col-span-2">
			<div
				id="container"
				class="h-full shadow-[0px_0.5rem_2rem_rgba(0,0,0,0.2)] rounded-xl overflow-hidden"
			/>
		</div>
		<div class="mt-8">
			<label class="opacity-50">Název vrstvy</label>
			<h2 class="text-2xl font-semibold mb-4">{{ config.name }}</h2>

			<label class="opacity-50">Id vrstvy</label>
			<h4 class="mb-4">{{ config.id }}</h4>

			<label class="opacity-50">Errory:</label>
			<template v-if="!valid">
				<ul>
					<li v-for="error in errors">{{ error }}</li>
				</ul>
			</template>
			<p v-else>Žádné errory, JSON se zdá být správně naformátován.</p>

			<button
				@click="publish"
				:disabled="!valid"
				class="border rounded px-4 py-2 mt-4 bg-blue-500 text-white hover:bg-blue-600 transition disabled:bg-slate-200 disabled:text-black disabled:opacity-30 disabled:cursor-not-allowed"
			>
				Publikovat
			</button>
		</div>
	</div>
</template>

<style>
.splitView {
	height: calc(100vh - 64px);
}
</style>
