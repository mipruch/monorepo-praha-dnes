<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import Button from "./ui/button/Button.vue";
import {Trash2} from "lucide-vue-next";
import WidgetMedium from "./WidgetMedium.vue";

defineEmits(["removeLayer"]);
const {layerData} = defineProps<{
	layerData: {
		pref: any;
		// res: any;
	};
}>();
</script>

<template>
	<div class="p-4 bg-grey-200 dark:bg-grey-700 rounded-lg">
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
		</div>
		<div class="flex flex-wrap gap-4">
			<WidgetMedium
				title="Vytíženost parkovišť"
				description="Vytíženost všech parkovišť dohromady je {{value}} %."
				:graph="{
					type: 'Ring',
					value: 49,
					strokeColor: 'blue',
				}"
			/>
			<WidgetMedium
				title="Vytíženost parkovišť"
				description="Vytíženost všech parkovišť dohromady je {{value}} %."
				:graph="{
					type: 'Tachometer',
					value: 26,
					minValue: 18,
					maxValue: 28,
					unit: '°',
					colorScheme: 'blue',
				}"
			/>
			<WidgetMedium
				title="PM2.5"
				description="Aktuální hodnota PM2.5 je {{value}} mq/m3. Fugiat nisi ullamco elit est dolore occaecat."
				:graph="{
					type: 'Bar',
					value: 10,
					strokeColor:
						'linear-gradient(to right,#ff5a00,#cace00,#00ed00,#00b8a2,#0066ff)',
				}"
			/>
			<WidgetMedium
				title="PM2.5"
				description="Aktuální hodnota PM2.5 je {{value}} mq/m3. Fugiat nisi ullamco elit est dolore occaecat."
				:graph="{
					type: 'Nearby',
				}"
			/>
			<WidgetMedium
				title="PM2.5"
				description="Aktuální hodnota PM2.5 je  mq/m3. Fugiat nisi ullamco elit est dolore occaecat."
				:graph="{
					type: 'Nearby',
				}"
			/>
			<WidgetMedium
				title="PM2.5"
				:graph="{
					type: 'Area',
					size: 'small',
					series: [
						{
							name: 'PM2.5',
							data: [30, 91, 45, 80, 50, 30, 70, 60, 100],
						},
					],
					xcategories: [
						'1.1.',
						'2.1.',
						'3.1.',
						'4.1.',
						'5.1.',
						'6.1.',
						'7.1.',
						'8.1.',
						'9.1.',
					],
				}"
			/>
		</div>
	</div>
</template>
