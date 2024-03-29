<script setup lang="ts">
import {Authenticator} from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
</script>

<template>
	<div class="">
		<Authenticator>
			<header
				class="h-16 px-8 flex flex-row align-middle items-center border-b"
			>
				<h1 class="text-3xl font-bold">Praha dnes CMS</h1>

				<button @click="$signOut" class="ml-auto">Sign Out</button>
				<a href="/" class="ml-8">Seznam vrstev</a>
			</header>

			<slot />
		</Authenticator>
	</div>
</template>
