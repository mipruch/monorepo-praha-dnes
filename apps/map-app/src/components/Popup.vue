<script setup lang="ts">
import Tag from "./Tag.vue";
import type {Layer, ComponentFilter} from "@/types";
import Tags from "./Tags.vue";
import dayjs from "dayjs";
import {getNestedProperty} from "@/stores/mapperUtilities";

dayjs.locale("cs");

const {properties, pref} = defineProps<{
	properties: any;
	pref: Layer;
}>();

const color = pref.color;

function handleStringPath(path: string) {
	// Získání hodnoty z properties podle zadaného path
	const result = getNestedProperty(properties, path);

	// Pokud není nalezena hodnota, vrátí se undefined
	if (!result) return undefined;

	// Pokud je hodnota pole, vrátí se jako naformátovaný string
	if (Array.isArray(result)) {
		if (result.length === 0) return undefined;
		return result.join("\n");
	}

	// Pokud je hodnota časový údaj, vrátí se jako naformátovaný čas
	if (checkISOFormat(result)) {
		return dayjs(result).format("D. M. YYYY HH:mm");
	}

	// Pokud je hodnota boolean, vrátí se jako Ano/Ne
	if (typeof result === "boolean") {
		return result ? "Ano" : "Ne";
	}

	// Jinak se vrátí hodnota jako string
	return result;
}

function handleTableValue(value: string | ComponentFilter): string | undefined {
	// Pokud je hodnota string, je to přímá cesta k hodnotě v properties
	if (typeof value === "string") {
		return handleStringPath(value);
	}

	// Pokud je hodnota objekt, je to filtr pro získání hodnoty z properties
	if (typeof value === "object") {
		// Získáme pole objektů, ve kterém budeme později hledat správný objekt
		handleObjectSearch(value);
	}

	// Pokud je hodnota jiného typu, vrátí se undefined
	return undefined;
}
function handleObjectSearch(tableValue: ComponentFilter): string | undefined {
	const array = getNestedProperty(
		properties,
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
function checkISOFormat(input: string) {
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
			<Tag :text="pref.category" />
			<Tag :text="pref.name" color="light" />
			<Tag
				v-if="pref.popupMapper.tags?.tertiary"
				:text="handleStringPath(pref.popupMapper.tags.tertiary)"
				color="dark"
			/>
		</Tags>
		<h6 class="mb-4" v-if="pref.popupMapper?.name">
			{{ handleStringPath(pref.popupMapper.name) }}
		</h6>
		<p v-if="pref.popupMapper?.paragraph">
			{{ properties[pref.popupMapper.paragraph] }}
		</p>
		<table v-if="pref.popupMapper.table" class="mb-4">
			<colgroup>
				<col style="width: 30%" />
				<col style="width: 70%" />
			</colgroup>
			<template
				v-for="(value, key) in pref.popupMapper.table"
				key="value"
			>
				<tr v-if="handleTableValue(value)">
					<td>{{ key }}:</td>
					<td class="whitespace-pre-wrap">
						{{ handleTableValue(value) }}
					</td>
				</tr>
			</template>
		</table>
		<img
			v-if="pref.popupMapper.image"
			:src="handleStringPath(pref.popupMapper.image)"
			:alt="handleStringPath(pref.popupMapper.name)"
		/>
	</div>
</template>

<style lang="scss">
.popup {
	outline-color: v-bind(color);

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
