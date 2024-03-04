<script setup lang="ts">
import {Plus, Minus, Trash2} from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tags from "./Tags.vue";
import Tag from "./Tag.vue";
import {pragueMap} from "../stores/mapStore";
import {onMounted, watch} from "vue";
import layers from "@/stores/preferences.json";

function refresh() {
	console.log(pragueMap.layers);
}
</script>

<template>
	<div class="bg-background rounded-[var(--gap)] p-7">
		<DropdownMenu>
			<DropdownMenuTrigger class="mb-12"
				><Button>
					<Plus class="mr-2" />
					Přidat vrstvu</Button
				></DropdownMenuTrigger
			>
			<DropdownMenuContent>
				<DropdownMenuLabel>Veřejná správa</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="pragueMap.addLayer('1')"
					>Úřady</DropdownMenuItem
				>
				<DropdownMenuItem
					v-for="{id, name} in layers"
					@click="pragueMap.addLayer(id)"
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

		<div
			class="p-4 bg-grey-200 rounded-lg mb-8"
			v-for="[key, value] in Array.from(pragueMap.activeLayers.entries())"
		>
			<div>
				<div class="flex flex-row justify-between pb-4">
					<Tags big v-slot="slotProps">
						<Tag
							color="green"
							:text="value.pref.name"
							:big="slotProps.big"
						/>
						<Tag
							color="light"
							:text="value.pref.name"
							:big="slotProps.big"
						/>
					</Tags>
					<Button
						variant="ghost"
						size="icon"
						@click="pragueMap.removeLayer(key)"
					>
						<Trash2 />
					</Button>
				</div>
				<div class="pl-1 mb-8">
					{{
						JSON.stringify(value.pref)
							.split('"')
							.join(" ")
							.slice(0, 300)
					}}
				</div>
			</div>
		</div>
	</div>
</template>
