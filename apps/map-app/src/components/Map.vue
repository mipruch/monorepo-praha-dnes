<script setup lang="ts"></script>

<template>
	<div class="w-full h-full">
		<div id="viewDiv" class="outline-0 w-full h-full" />
		<div
			id="layersButton"
			class="w-[100px] h-[100px] bg-foreground rounded-[var(--gap)]"
		/>
		<div id="zoomGroup" class="grid gap-[7px]">
			<div
				class="w-8 h-8 bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomin"
			>
				+
			</div>
			<div
				class="w-8 h-8 bg-foreground rounded-[7px] text-background grid place-items-center cursor-pointer text-xl hover:opacity-75 transition-all duration-100 ease-in-out select-none"
				id="zoomout"
			>
				-
			</div>
		</div>
	</div>
</template>

<style></style>
