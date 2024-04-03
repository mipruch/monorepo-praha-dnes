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
	paragraph: string;
	tags: {
		tertiary: string;
		warning: string;
	};
	table: {
		[key: string]: string | ComponentFilter;
	};
	image: string;
};

export type ComponentFilter = {
	arrayPath: string;
	where: {
		path: string;
		equals: string;
	};
	valuePath: string;
	unitPath: string;
};
