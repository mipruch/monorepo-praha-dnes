export type Layer = {
	id: string;
	name: string;
	paragraph: string;
	color: string;
	fetchUrl: string;
	iconUrl: string;
	popupMapper: Popup;
	category: string;
};

export type Popup = {
	name: string;
	title: string;
	paragraph: string;
	tags: {
		tertiary: string;
		warning: string;
	};
	table: {
		valuePath: string;
		unitPath: string;
	}[];
};
