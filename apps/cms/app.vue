<script setup lang="ts">
import {Authenticator} from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
</script>
<template>
	<Authenticator>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</Authenticator>
</template>
