<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";
import dayjs from "dayjs";
import {getNestedProperty} from "@/stores/mapperUtilities";
import type {Layer, ComponentFilter} from "@/types";

dayjs.locale("cs");

const {featureProperties, layerConfig} = defineProps<{
	featureProperties: {[key: string]: any};
	layerConfig: Layer;
}>();

const accentColor = layerConfig.color;

function resolveStringPath(path: string) {
	// Získání hodnoty z properties podle zadaného path
	const result = getNestedProperty(featureProperties, path);

	// Pokud není nalezena hodnota, vrátí se undefined
	if (!result) return undefined;

	// Pokud je hodnota pole, vrátí se jako naformátovaný string
	if (Array.isArray(result)) {
		if (result.length === 0) return undefined;
		return result.join("\n");
	}

	// Pokud je hodnota časový údaj, vrátí se jako naformátovaný čas
	if (isStringDate(result)) {
		return dayjs(result).format("D. M. YYYY HH:mm");
	}

	// Pokud je hodnota boolean, vrátí se jako Ano/Ne
	if (typeof result === "boolean") {
		return result ? "Ano" : "Ne";
	}

	// Jinak se vrátí hodnota jako string
	return result;
}

function resolveTableValue(
	value: string | ComponentFilter
): string | undefined {
	if (typeof value === "string") {
		return resolveStringPath(value);
	}

	if (typeof value === "object") {
		return handleObjectSearch(value);
	}

	return undefined;
}

function handleObjectSearch(tableValue: ComponentFilter): string | undefined {
	const array = getNestedProperty(
		featureProperties,
		tableValue.arrayPath
	) as Array<any>;

	// Najdeme objekt, který odpovídá uživatelem definované podmínce (kde se shodují atributy)
	const foundObj = array.find((obj: any) => {
		const tableValuePath = tableValue.where.path.split(".");
		const value = tableValuePath.reduce((acc, curr) => acc[curr], obj);
		return value == tableValue.where.equals;
	});

	// Pokud objekt není nalezen, vrátí se undefined
	if (!foundObj) return undefined;

	// Získáme hodnotu z nalezeného objektu
	const value = getNestedProperty(foundObj, tableValue.valuePath);

	// Pokud je hodnota undefined, vrátí se undefined
	if (value === undefined) return undefined;
	// Pokud je hodnota pole, vrátí se jako naformátovaný string
	if (Array.isArray(value)) return value.join(", ");

	// Pokud je v properties definovaná jednotka, přidá se k hodnotě
	if (tableValue.unitPath) {
		const unit = getNestedProperty(foundObj, tableValue.unitPath);
		return `${value} ${unit}`;
	}

	return value;
}

function isStringDate(input: string) {
	const parsedDate = dayjs(input);
	if (!parsedDate.isValid()) {
		return false; // The date is not valid
	}

	// Compare the input with its ISO string representation
	const isISOFormat = input === parsedDate.toISOString();
	const isOffsetFormat = input === parsedDate.format("YYYY-MM-DDTHH:mm:ssZ");

	return isISOFormat || isOffsetFormat;
}
</script>

<template>
	<div
		:class="`p-[17px] bg-grey-200 dark:bg-grey-900 dark:text-white/80 rounded-[10px] _card outline popup outline-offset-[3px]`"
	>
		<Tags class="mb-4">
			<Tag :text="layerConfig.category" />
			<Tag :text="layerConfig.name" color="light" />
			<Tag
				v-if="layerConfig.popupMapper.tags?.tertiary"
				:text="resolveStringPath(layerConfig.popupMapper.tags.tertiary)"
				color="dark"
			/>
		</Tags>
		<h6 class="mb-4" v-if="layerConfig.popupMapper?.name">
			{{ resolveStringPath(layerConfig.popupMapper.name) }}
		</h6>
		<p v-if="layerConfig.popupMapper?.paragraph">
			{{ resolveStringPath(layerConfig.popupMapper.paragraph) }}
		</p>
		<table v-if="layerConfig.popupMapper.table" class="mb-4">
			<colgroup>
				<col style="width: 30%" />
				<col style="width: 70%" />
			</colgroup>
			<template
				v-for="(value, key) in layerConfig.popupMapper.table"
				key="value"
			>
				<tr v-if="resolveTableValue(value)">
					<td>{{ key }}:</td>
					<td class="whitespace-pre-wrap">
						{{ resolveTableValue(value) }}
					</td>
				</tr>
			</template>
		</table>
		<img
			v-if="layerConfig.popupMapper.image"
			:src="resolveStringPath(layerConfig.popupMapper.image)"
			:alt="resolveStringPath(layerConfig.popupMapper.name)"
		/>
	</div>
</template>

<style lang="scss">
.popup {
	outline-color: v-bind(accentColor);

	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		tr {
			td {
				padding: 0.4rem;
				&:first-child {
					font-weight: 600;
					padding-right: 1rem;
				}
				&:last-child {
					word-wrap: break-word;
				}
			}
			&:nth-child(even) {
				background-color: #d3d3d3;
				@apply dark:bg-grey-800;
			}
		}
	}

	img {
		width: 100%;
		height: auto;
		border-radius: 0.25rem;
	}
}
</style>
