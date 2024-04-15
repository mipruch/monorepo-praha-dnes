<script setup lang="ts">
import Ajv from "ajv";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import {schemas} from "~/schemas/schemas2";
import getSchema from "~/schemas/getSchema";
import {fetchAuthSession} from "aws-amplify/auth";
import {toast} from "~/components/ui/toast/use-toast";

const route = useRoute();

type Config = {
	name: string;
	id: string;
	json: string;
};

const config: Ref<Config> = ref({
	name: "",
	id: "",
	json: "",
});

const {data: json} = await useFetch(
	`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${route.params.id}`
);

const title = useState("title");
title.value = (json.value as Config).name;

useHead({
	title: `${title.value} - Praha dnes CMS`,
	meta: [
		{
			name: "description",
			content: "Toto je stránka pro editaci nové vrstvy.",
		},
	],
});

const valid = ref(false);

async function edit() {
	const {idToken} = (await fetchAuthSession()).tokens!;

	const headers = new Headers();
	headers.append("Authorization", idToken as any as string);

	const body = JSON.parse(config.value.json);

	const {error} = await useFetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${route.params.id}`,
		{
			method: "PUT",
			body: body,
			headers: headers,
			onResponseError: ({request, response, options}) => {
				toast({
					title: "Vyskytla se chyba.",
					description: response._data,
					variant: "destructive",
				});
			},
		}
	);

	if (!error.value) {
		await navigateTo(`/`);
	}
}

const errors = ref<string[]>([]);

onMounted(async () => {
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
	var modelUri = monaco.Uri.parse(Math.random().toString()); // a made up unique URI for our model
	var model = monaco.editor.createModel(
		JSON.stringify(json.value),
		"json",
		modelUri
	);
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
	<div class="grid lg:grid-cols-3 gap-8 splitView">
		<div class="p-12 h-full col-span-2 w-full">
			<div
				id="container"
				class="h-full shadow-[0px_0.5rem_2rem_rgba(0,0,0,0.2)] rounded-xl overflow-hidden outline-grey-300"
			/>
		</div>
		<div class="mt-8">
			<label class="opacity-50">Název vrstvy</label>
			<h2 class="text-2xl font-semibold mb-4">{{ config.name }}</h2>

			<label class="opacity-50">Id vrstvy</label>
			<h4 class="mb-4">{{ route.params.id }}</h4>

			<label class="opacity-50">Errory:</label>
			<template v-if="!valid">
				<ul>
					<li v-for="error in errors">{{ error }}</li>
				</ul>
			</template>
			<p v-else>Žádné errory, JSON se zdá být správně naformátován.</p>

			<Button @click="edit" :disabled="!valid" class="mt-4">
				Publikovat
			</Button>
		</div>
	</div>
</template>

<style>
.splitView {
	height: calc(100vh - 64px);
}
</style>
