<script setup lang="ts">
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
import {toast} from "~/components/ui/toast/use-toast";

definePageMeta({
	title: "Seznam vrstev",
});

useHead({
	title: "Seznam vrstev - Praha dnes CMS",
	meta: [
		{
			name: "description",
			content:
				"Toto je CMS stránka pro správu vrstev v aplikaci Praha dnes.",
		},
	],
});

const title = useState("title");
title.value = "Seznam vrstev";

const {
	data: layers,
	pending,
	refresh,
} = useFetch<
	{
		id: string;
		name: string;
	}[]
>(
	"https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers?excludeConfig=true",
	{method: "GET"}
);

async function remove(layerId: string) {
	const {idToken} = (await fetchAuthSession()).tokens!;

	const headers = new Headers();
	headers.append("Authorization", idToken as any as string);

	const {data, error} = await useFetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${layerId}`,
		{
			method: "DELETE",
			headers: headers,
			onResponse: (response) => {
				layers.value = layers.value!.filter(
					(layer) => layer.id !== layerId
				);
			},
			onResponseError: (error) => {
				console.log("error", error);
			},
		}
	);

	if (!error.value) {
		toast({
			title: "Vrstva byla úspěšně odstraněna.",
		});
	}
}
</script>
<template>
	<div class="max-w-7xl mx-auto px-4 pb-12 mt-8">
		<div class="flex justify-between items-center mb-6 pl-6">
			<h2 class="text-2xl font-semibold">Seznam vrstev</h2>
			<NuxtLink to="/new-layer">
				<Button variant="outline">
					<LucidePlus class="mr-2" />
					Přidat vrstvu
				</Button>
			</NuxtLink>
		</div>
		<div class="flex flex-col gap-2">
			<NuxtLink
				v-for="layer in layers!"
				key="layer.id"
				class="flex justify-between group hover:bg-gray-100 py-4 px-6 rounded-lg items-center"
				:to="`/layers-${layer.id}`"
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
					aria-label="Odstranit vrstvu"
				>
					<LucideTrash class="" />
				</Button>
			</NuxtLink>
		</div>
	</div>
</template>
