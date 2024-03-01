<script setup lang="ts">
import Tag from "./Tag.vue";
import Tags from "./Tags.vue";

const {properties} = defineProps({
	properties: {
		type: Object,
		required: true,
	},
});
</script>
<template>
	<div
		class="p-[17px] bg-grey-200 rounded-[10px] _card outline outline-orange outline-offset-[3px]"
	>
		<Tags class="mb-4">
			<Tag text="Veřejná správa" />
			<Tag text="Úřad" color="light" />
			<Tag text="Bude brzy zavírat" color="notice" />
		</Tags>
		<h6 class="mb-4">{{ properties.name }}</h6>
		<table>
			<tr>
				<td>Adresa:</td>
				<td>
					Úřad městské části Praha 6, náměstí 5. května 1640/65, 160
					00 Praha 6
				</td>
			</tr>
			<tr>
				<td>Telefon:</td>
				<td>233 113 111</td>
			</tr>
			<tr>
				<td>Email:</td>
				<td>mestskacast@email.cz</td>
			</tr>
		</table>
	</div>
</template>
