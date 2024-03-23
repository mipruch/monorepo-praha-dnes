import {createApp} from "vue";
import App from "./App.vue";
import "./index.css";
import VueApexCharts from "vue3-apexcharts";

import Ring from "@/components/graphs/Ring.vue";
import Tachometer from "@/components/graphs/Tachometer.vue";
import Bar from "@/components/graphs/Bar.vue";
import Area from "@/components/graphs/Area.vue";
import Nearby from "@/components/graphs/Nearby.vue";
import List from "@/components/graphs/List.vue";

import {Amplify} from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";

Amplify.configure(amplifyconfig);

const app = createApp(App);

app.component("Ring", Ring)
	.component("List", List)
	.component("Tachometer", Tachometer)
	.component("Bar", Bar)
	.component("Area", Area)
	.component("Nearby", Nearby);

app.use(VueApexCharts);
app.mount("#app");
