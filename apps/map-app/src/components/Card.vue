<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import Button from "./ui/button/Button.vue";
import {Trash2} from "lucide-vue-next";
import WidgetMedium from "./WidgetMedium.vue";
import WidgetSmall from "./WidgetSmall.vue";
import WidgetLarge from "./WidgetLarge.vue";

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
		<div class="w-full overflow-x-scroll flex flex-row gap-[10px]">
			<div
				id="widgets-small"
				class="grid grid-flow-col grid-rows-2 gap-[10px]"
			>
				<WidgetSmall
					title="Aktuální průměrná cena parkování"
					value="32,7"
					text="korun za hodinu."
				/>
				<WidgetSmall
					title="Počet otevřených parkovišť"
					value="106"
					text="z celkového počtu 120 parkovišť."
				/>
			</div>
			<div
				id="widgets-large"
				class="grid grid-flow-col grid-rows-1 gap-[10px]"
			>
				<WidgetLarge
					title="Nejméně vytížená parkoviště"
					:graph="{
						type: 'Bar',
						size: 'small',
						series: [
							{
								data: [30, 91, 45, 80, 50, 30, 70, 60, 100],
							},
						],
						unit: 'Kč',
						// xcategories: [1, 2, 3, 4],
					}"
				/>
				<WidgetLarge
					title="Nejméně vytížená parkoviště"
					:graph="{
						type: 'List',
						paragraph:
							'Seznam parkovišt s největším počtem volných míst:',
						items: [
							'Přátelství 356/61',
							'Pražská 356/61',
							'Pražská 356/61',
							'Pražská 356/61',
							'Pražská 356/61',
						],
					}"
				/>
			</div>
			<div
				id="widgets-medium"
				class="grid grid-flow-col grid-rows-2 gap-[10px]"
			>
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
	</div>
</template>
