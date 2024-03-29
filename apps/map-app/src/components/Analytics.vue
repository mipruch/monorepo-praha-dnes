<script setup lang="ts">
import {Plus} from "lucide-vue-next";
import {Loader2} from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {pragueMap} from "../stores/mapStore";
import {ref} from "vue";
import Card from "./Card.vue";

import type {Layer} from "@/types";

type LayerConfig = {
	id: string;
	name: string;
	category: string;
	config: Layer;
};

const layers: LayerConfig[] = await fetch(
	"https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers?excludeConfig=true"
).then((r) => r.json());

const isLoading = ref(false);

async function addLayer(value: Layer) {
	isLoading.value = true;
	const layer: Layer = await fetch(
		`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${value.id}`
	).then((r) => r.json());
	pragueMap.addLayer(layer).then((res) => {
		isLoading.value = false;
	});
}
</script>

<template>
	<div
		class="bg-background rounded-[var(--gap)] p-7 h-full overflow-y-scroll"
	>
		<div class="flex flex-row items-center mb-12">
			<DropdownMenu>
				<DropdownMenuTrigger class="mr-4 flex">
					<Button>
						<Plus class="mr-2" />
						Přidat vrstvu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<template
						v-for="(value, key, index) in Object.groupBy(
							layers,
							(layer) => layer.category
						)"
					>
						<DropdownMenuSeparator v-if="index !== 0" />
						<DropdownMenuLabel>{{ key }}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							v-for="layer in value"
							@click="addLayer(layer as unknown as Layer)"
							:disabled="pragueMap.activeLayers.has(layer.id)"
						>
							{{ layer.name }}
						</DropdownMenuItem>
					</template>
				</DropdownMenuContent>
			</DropdownMenu>
			<Loader2 class="w-8 h-8 animate-spin" v-if="isLoading" />
		</div>
		<TransitionGroup name="cards" tag="div" class="relative">
			<Card
				v-for="[key, value] in Array.from(
					pragueMap.activeLayers.entries()
				)"
				:key="key"
				:layer-data="value"
				@remove-layer="pragueMap.removeLayer(key)"
				class="mb-8"
			/>
		</TransitionGroup>
	</div>
</template>

<style lang="scss">
.cards-move,
.cards-enter-active,
.cards-leave-active {
	transition: all 0.5s ease;
}
.cards-enter-from,
.cards-leave-to {
	opacity: 0;
	transform: translateY(-30px);
}

.cards-leave-active {
	position: absolute;
}
</style>
