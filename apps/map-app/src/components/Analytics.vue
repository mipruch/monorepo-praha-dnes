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
import {ref, watch} from "vue";
import layers from "@/stores/preferences.json";
import Card from "./Card.vue";

import type {Layer} from "@/types";

function addLayer(value: Layer) {
	isLoading.value = true;
	pragueMap.addLayer(value).then(() => {
		isLoading.value = false;
	});
}

const isLoading = ref(false);
</script>

<template>
	<div class="bg-background rounded-[var(--gap)] p-7">
		<div class="flex flex-row items-center mb-12">
			<DropdownMenu>
				<DropdownMenuTrigger class="mr-4 flex"
					><Button>
						<Plus class="mr-2" />
						Přidat vrstvu</Button
					></DropdownMenuTrigger
				>
				<DropdownMenuContent>
					<div
						v-for="(value, key, index) in Object.groupBy(
							layers,
							({category}) => category
						)"
					>
						<DropdownMenuSeparator v-if="index !== 0" />
						<DropdownMenuLabel>{{ key }}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							v-for="layer in value"
							@click="addLayer(layer as unknown as Layer)"
							:disabled="pragueMap.activeLayers.has(layer.id)"
							>{{ layer.name }}</DropdownMenuItem
						>
					</div>
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
				:layer-id="key"
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
