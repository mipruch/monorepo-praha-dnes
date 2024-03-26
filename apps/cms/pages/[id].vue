<script setup lang="ts">
// import * as monaco from "monaco-editor";

const route = useRoute();

const layers = await fetch(
	`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${route.params.id}`
).then((r) => r.text());

const value = ref("function hello() {\n\talert('Hello world!');\n}");
value.value = layers;

const editorRef = ref();

// For example, add greeting action to editor...
onMounted(() => {
	watch(
		() => editorRef.value.$editor,

		() => {
			function formatDocument() {
				editorRef.value.$editor
					.getAction("editor.action.formatDocument")
					.run();
			}

			console.log("now");
			editorRef.value.$editor.onDidChangeModelLanguageConfiguration(
				formatDocument
			);

			/// on every initialization
			editorRef.value.$editor.onDidLayoutChange(formatDocument);
		}
	);
});
</script>
<template>
	<div>
		<h1>Praha dnes CMS</h1>
		<h3>Seznam vrstev</h3>
		<div style="border: black 2px solid; padding: 0.5rem; height: 600px">
			<MonacoEditor
				v-model="value"
				lang="json"
				style="height: 100%"
				ref="editorRef"
				:options="{theme: 'vs-dark'}"
			/>
		</div>
		{{ value }}
	</div>
</template>
