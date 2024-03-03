<script setup lang="ts">
import {Plus, Minus} from "lucide-vue-next";
import Button from "./Button.vue";
import Tags from "./Tags.vue";
import Tag from "./Tag.vue";
import {pragueMap} from "../stores/mapStore";
import {onMounted, watch} from "vue";

function refresh() {
	console.log(pragueMap.layers);
}
</script>

<template>
	<div class="bg-background rounded-[var(--gap)] p-7">
		<Button @click="pragueMap.addLayer('Municipality')">
			<Plus class="mr-2" />
			Přidat vrstvu
		</Button>
		<Button @click="pragueMap.removeLayer('Municipality')">
			<Minus class="mr-2" />
			Odebrat vrstvu
		</Button>
		<Button @click="refresh"> refresh </Button>
		<div class="text-orange text-3xl"></div>
		<h1 class="">Officia ut elit esse officia sint culpa eu commodo</h1>
		<h2>Officia ut elit esse officia sint culpa eu commodo</h2>
		<h3>Officia ut elit esse officia sint culpa eu commodo</h3>
		<h4>Officia ut elit esse officia sint culpa eu commodo</h4>
		<h5>Officia ut elit esse officia sint culpa eu commodo</h5>
		<h6>Officia ut elit esse officia sint culpa eu commodo</h6>
		<p>Officia ut elit esse officia sint culpa eu commodo</p>

		<Tags big v-slot="slotProps">
			<Tag color="green" text="Hello World" :big="slotProps.big" />
			<Tag color="green" text="Hello World" :big="slotProps.big" />
		</Tags>
	</div>
</template>
