<script setup lang="ts">
import Map from "./components/Map.vue";
import Analytics from "./components/Analytics.vue";

import {post} from "aws-amplify/api";

async function postTodo() {
	try {
		const restOperation = post({
			apiName: "prahadnesapi",
			path: "/layers/2",
			options: {
				body: {
					message: "Mow the lawn",
				},
			},
		});

		const {body} = await restOperation.response;
		const response = await body.json();

		console.log("POST call succeeded");
		console.log(response);
	} catch (e: any) {
		console.log("POST call failed: ", JSON.parse(e.response.body));
	}
}

postTodo();
</script>

<template>
	<div
		class="grid grid-cols-2 gap-[var(--gap)] p-[var(--gap)] h-screen w-screen relative bg-black"
	>
		<Map class="bg-background rounded-[var(--gap)] overflow-hidden" />

		<Analytics />
	</div>
</template>
