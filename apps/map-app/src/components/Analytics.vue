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

function refresh() {
	console.log(pragueMap.layers);
}

function addLayer(id: string) {
	isLoading.value = true;
	pragueMap.addLayer(id).then(() => {
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
					<DropdownMenuLabel>Veřejná správa</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						v-for="{id, name} in layers"
						@click="addLayer(id)"
						:disabled="pragueMap.activeLayers.has(id)"
						>{{ name }}</DropdownMenuItem
					>
					<DropdownMenuItem>Magistrát</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>Kultura</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Divadla</DropdownMenuItem>
					<DropdownMenuItem>Koncetry</DropdownMenuItem>
					<DropdownMenuItem>Sport</DropdownMenuItem>
					<DropdownMenuItem>Kino</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>Doprava</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="pragueMap.addLayer('2')"
						>Parkoviště</DropdownMenuItem
					>
					<DropdownMenuItem>Koncetry</DropdownMenuItem>
					<DropdownMenuItem>Sport</DropdownMenuItem>
					<DropdownMenuItem>Kino</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Loader2 class="w-8 h-8 animate-spin" v-if="isLoading" />
		</div>

		<Card
			v-for="[key, value] in Array.from(pragueMap.activeLayers.entries())"
			:layer-id="key"
			:layer-data="value"
			@remove-layer="pragueMap.removeLayer(key)"
		/>
	</div>
</template>
