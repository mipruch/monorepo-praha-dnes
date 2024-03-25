<script setup lang="ts">
const route = useRoute();

const layers = await fetch(
	`https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers/${route.params.id}`
).then((r) => r.json());
</script>
<template>
	<div>
		<h1>Praha dnes CMS</h1>
		<h3>Seznam vrstev</h3>
		<div>
			{{ layers }}
		</div>
	</div>
</template>
