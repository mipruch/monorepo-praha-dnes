<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import Button from "./ui/button/Button.vue";
import {Trash2} from "lucide-vue-next";

defineEmits(["removeLayer"]);

const {layerData} = defineProps<{
	layerData: {
		pref: any;
		res: any;
	};
}>();
</script>

<template>
	<div class="p-4 bg-grey-200 rounded-lg">
		<div>
			<div class="flex flex-row justify-between pb-4">
				<Tags big v-slot="slotProps">
					<Tag
						color="green"
						:text="layerData.pref.category"
						:big="slotProps.big"
					/>
					<Tag
						color="light"
						:text="layerData.pref.name"
						:big="slotProps.big"
					/>
				</Tags>
				<Button
					variant="ghost"
					size="icon"
					@click="$emit('removeLayer')"
				>
					<Trash2 />
				</Button>
			</div>
			<p class="pl-1 mb-8">
				{{ layerData.pref.paragraph }}
			</p>
			<div>Grafy</div>
		</div>
	</div>
</template>
