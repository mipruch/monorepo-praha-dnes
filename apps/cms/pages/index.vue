<script setup>
const layers = await fetch(
	"https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers?excludeConfig=true"
).then((r) => r.json());
</script>
<template>
	<div>
		<h1>Praha dnes CMS</h1>
		<h3>Seznam vrstev</h3>
		<div>
			<a v-for="layer in layers" :href="`/${layer.id}`">{{
				layer.name
			}}</a>
		</div>
	</div>
</template>
