<script setup lang="ts">
const route = useRoute();
const title: Ref<string> = useState("title");
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<template>
	<div class="">
		<header
			class="h-min-16 py-4 px-8 flex flex-row align-middle items-center border-b"
		>
			<Tags big v-slot="slotProps">
				<h1>
					<NuxtLink to="/">
						<Tag
							color="green"
							text="Praha dnes CMS"
							:big="slotProps.big"
						/>
					</NuxtLink>
				</h1>
				<!-- <Tag
					color="light"
					:text="$route.meta.title as string"
					:big="slotProps.big"
				/> -->
				<Tag color="light" :text="title" :big="slotProps.big" />
			</Tags>

			<Button @click="$signOut" variant="outline" class="ml-auto">
				<LucideLogOut class="mr-2" />
				Odhlásit se
			</Button>
		</header>

		<slot />
		<Toaster />
	</div>
</template>
