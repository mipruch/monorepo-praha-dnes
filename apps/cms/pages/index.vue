<script setup lang="ts">
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";

definePageMeta({
	title: "Seznam vrstev",
});

const title = useState("title");
title.value = "Seznam vrstev";

const {
	data: layers,
	pending,
	refresh,
} = useFetch(
	"https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers?excludeConfig=true",
	{method: "GET"}
);

async function remove(layerId: string) {
	const {idToken} = (await fetchAuthSession()).tokens;

	const headers = new Headers();
	headers.append("Authorization", idToken);

	const {data} = useFetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${layerId}`,
		{
			method: "DELETE",
			headers: headers,
			onResponse: (response) => {
				layers.value = layers.value.filter(
					(layer) => layer.id !== layerId
				);
			},
			onResponseError: (error) => {
				console.log("error", error);
			},
		}
	);
}
</script>
<template>
	<div class="max-w-7xl mx-auto px-4 pb-12 mt-8">
		<h3 class="text-2xl font-semibold mb-6 pl-6">Seznam vrstev</h3>
		<div class="flex flex-col gap-2">
			<a
				v-for="layer in layers"
				key="layer.id"
				class="flex justify-between group hover:bg-gray-100 py-4 px-6 rounded-lg items-center"
				:href="`/${layer.id}`"
			>
				<div>
					<p class="text-lg mb-1">
						{{ layer.name }}
					</p>
					<p class="text-sm opacity-70">
						{{ layer.id }}
					</p>
				</div>

				<Button
					@click.prevent="remove(layer.id)"
					variant="outline"
					size="icon"
					class="hidden group-hover:grid"
				>
					<LucideTrash class="" />
				</Button>
			</a>
		</div>
	</div>
</template>
