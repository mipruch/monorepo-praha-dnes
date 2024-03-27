<script setup>
const layers = await fetch(
	"https://abuz6lqd47.execute-api.eu-central-1.amazonaws.com/prod/layers?excludeConfig=true"
).then((r) => r.json());
</script>
<template>
	<div class="max-w-7xl mx-auto px-4 pb-12 mt-8">
		<h3 class="text-2xl font-semibold mb-6">Seznam vrstev</h3>
		<div class="flex flex-col gap-6">
			<a
				v-for="layer in layers"
				:href="`/${layer.id}`"
				class="hover:opacity-50 transition hover:translate-x-6"
			>
				<div>
					<h5 class="text-lg mb-1">
						{{ layer.name }}
					</h5>
					<p class="text-sm opacity-70">
						{{ layer.id }}
					</p>
				</div>
			</a>
		</div>
	</div>
</template>
