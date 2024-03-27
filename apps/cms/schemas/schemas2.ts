const baseSchema = {
	$id: "http://example.com/schemas/baseSchema.json",
	type: "object",
	properties: {
		id: {
			type: "string",
			pattern: "^[a-z0-9-]+$",
		},
		name: {
			type: "string",
		},
		category: {
			type: "string",
		},
		paragraph: {
			type: "string",
		},
		color: {
			type: "string",
			pattern: "^#([0-9A-F]{3}){1,2}$|^#([0-9A-F]{4}){1,2}$",
		},
		fetchUrl: {
			type: "string",
		},
		iconUrl: {
			enum: [
				"books.svg",
				"climate.svg",
				"cross.svg",
				"home.svg",
				"note.svg",
				"parking.svg",
				"sportcourt.svg",
				"tram.svg",
				"tree.svg",
			],
		},
		headers: {
			type: "object",
		},
		popupMapper: {
			$ref: "popupMapperSchema.json", // reference the second schema
		},
		widgets: {
			type: "object",
			properties: {
				small: {
					type: "array",
					items: {
						$ref: "smallWidgetSchema.json",
					},
				},
				medium: {
					type: "array",
					items: {
						$ref: "mediumWidgetSchema.json",
					},
				},
				large: {
					type: "array",
					items: {
						$ref: "largeWidgetSchema.json",
					},
				},
			},
		},
	},
	required: ["id", "name", "category", "color", "fetchUrl", "popupMapper"],
};
const popupMapperSchema = {
	$id: "http://example.com/schemas/popupMapperSchema.json",
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		tags: {
			type: "object",
			properties: {
				tertiary: {
					type: "string",
				},
				warning: {
					type: "string",
				},
			},
		},
		table: {
			type: "object",
		},
		image: {
			type: "string",
		},
		paragraph: {
			type: "string",
		},
	},
	required: ["name"],
};
const smallWidgetSchema = {
	$id: "http://example.com/schemas/smallWidgetSchema.json",
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		value: {
			$ref: "valueSchema.json",
		},
		text: {
			type: "string",
		},
	},
	required: ["title", "value"],
};
const mediumWidgetSchema = {
	$id: "http://example.com/schemas/mediumWidgetSchema.json",
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		description: {
			type: "string",
		},
		graph: {
			$ref: "graphSchema.json",
		},
	},
	required: ["title", "graph"],
};
const largeWidgetSchema = {
	$id: "http://example.com/schemas/largeWidgetSchema.json",
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		graph: {
			$ref: "graphSchema.json",
		},
	},
	required: ["title", "graph"],
};
const graphSchema = {
	$id: "http://example.com/schemas/graphSchema.json",
	type: "object",
	properties: {
		type: {
			type: "string",
		},
		strokeColor: {
			oneOf: [
				{
					type: "object",
				},
				{
					type: "string",
				},
			],
		},
		value: {
			$ref: "valueSchema.json",
		},
		paragraph: {
			type: "string",
		},
		sortBy: {
			type: "string",
		},
		sortMethod: {
			type: "string",
		},
		textPath: {
			type: "string",
		},
		minValue: {
			type: "number",
		},
		maxValue: {
			type: "number",
		},
		unit: {
			type: "string",
		},
	},
	required: ["type"],
};
const valueSchema = {
	$id: "http://example.com/schemas/valueSchema.json",
	type: "object",
	properties: {
		mathOperation: {
			type: "string",
		},
		attributePath: {
			oneOf: [
				{
					$ref: "attributePathSchema.json",
				},
				{
					type: "string",
				},
			],
		},
		value1: {
			$ref: "valueSchema.json",
		},
		value2: {
			$ref: "valueSchema.json",
		},
	},
	required: ["mathOperation"],
};
const attributePathSchema = {
	$id: "http://example.com/schemas/attributePathSchema.json",
	type: "object",
	properties: {
		arrayPath: {
			type: "string",
		},
		valuePath: {
			type: "string",
		},
		where: {
			type: "object",
			properties: {
				path: {
					type: "string",
				},
				pathDay: {
					type: "string",
				},
				pathTimeOpens: {
					type: "string",
				},
				pathTimeCloses: {
					type: "string",
				},
				equals: {
					type: "string",
				},
			},
		},
	},
	required: ["arrayPath"],
};

export const schemas = [
	baseSchema,
	popupMapperSchema,
	smallWidgetSchema,
	mediumWidgetSchema,
	largeWidgetSchema,
	graphSchema,
	valueSchema,
	attributePathSchema,
];
