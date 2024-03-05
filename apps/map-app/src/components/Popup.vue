<script setup lang="ts">
import Tag from "./Tag.vue";
import type {Layer, ComponentFilter} from "@/types";
import Tags from "./Tags.vue";

const {properties, pref} = defineProps<{
	properties: any;
	pref: Layer;
}>();

const color = pref.color;

function handleMapper(path: string) {
	const splitted = path.split(".");
	const length = splitted.length;
	let result = properties;
	for (let i = 0; i < length; i++) {
		result = result[splitted[i]];
	}
	console.log(result);

	if (!result) return "N/A";
	if (Array.isArray(result) && result.length === 0) {
		return "N/A";
	}

	if (Array.isArray(result)) {
		return result.join(", ");
	}

	return result;
}

function handleTableValue(tableValue: string | ComponentFilter) {
	if (typeof tableValue === "string") {
		return handleMapper(tableValue);
	}
	// return tableValue;
	if (typeof tableValue === "object") {
		const arrayPath = tableValue.arrayPath.split(".");
		const array = arrayPath.reduce((acc, curr) => acc[curr], properties);

		const foundObj = array.find((obj: any) => {
			const tableValuePath = tableValue.where.path.split(".");
			const value = tableValuePath.reduce((acc, curr) => acc[curr], obj);
			return value == tableValue.where.equals;
		});
		if (!foundObj) return "N/A";
		// return foundObj;

		const valuePath = tableValue.valuePath.split(".");
		const value = valuePath.reduce((acc, curr) => acc[curr], foundObj);

		if (tableValue.unitPath) {
			const unitPath = tableValue.unitPath.split(".");
			const unit = unitPath.reduce((acc, curr) => acc[curr], foundObj);
			return `${value} ${unit}`;
		}

		return value;
	}
	return tableValue;
}
</script>
<template>
	<div
		:class="`p-[17px] bg-grey-200 rounded-[10px] _card outline popup outline-offset-[3px]`"
	>
		<Tags class="mb-4">
			<Tag :text="pref.category" />
			<Tag :text="pref.name" color="light" />
			<Tag
				v-if="pref.popupMapper.tags?.tertiary"
				:text="handleMapper(pref.popupMapper.tags.tertiary)"
				color="dark"
			/>
		</Tags>
		<h6 class="mb-4" v-if="pref.popupMapper?.name">
			{{ handleMapper(pref.popupMapper.name) }}
		</h6>
		<p v-if="pref.popupMapper?.paragraph">
			{{ properties[pref.popupMapper.paragraph] }}
		</p>
		<table v-if="pref.popupMapper.table">
			<template v-for="(value, key) in pref.popupMapper.table">
				<tr v-if="handleTableValue(value) != 'N/A'">
					<td>{{ key }}:</td>
					<td>
						{{ handleTableValue(value) }}
					</td>
				</tr>
			</template>
		</table>
		<img
			v-if="pref.popupMapper.image"
			:src="handleMapper(pref.popupMapper.image)"
			:alt="handleMapper(pref.popupMapper.name)"
		/>
	</div>
</template>

<style lang="scss">
.popup {
	outline-color: v-bind(color);

	table {
		width: 100%;
		border-collapse: collapse;
		tr {
			// border-bottom: 1px solid #c7c7c7;
			td {
				padding: 0.4rem;
				&:first-child {
					font-weight: 600;
					padding-right: 1rem;
				}
			}
			&:nth-child(even) {
				background-color: #d3d3d3;
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
