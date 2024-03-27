export default function getSchema(modelUri: any) {
	return [
		{
			uri: "baseSchema", // id of the first schema
			fileMatch: [modelUri.toString()], // associate with our model
			schema: {
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
						format: "uri",
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
						$ref: "popupmapper", // reference the second schema
					},
					widgets: {
						type: "object",
						properties: {
							small: {
								type: "array",
								items: {
									$ref: "smallwidget",
								},
							},
							medium: {
								type: "array",
								items: {
									$ref: "mediumwidget",
								},
							},
							large: {
								type: "array",
								items: {
									$ref: "largewidget",
								},
							},
						},
					},
				},
				required: [
					"id",
					"name",
					"category",
					"color",
					"fetchUrl",
					"popupMapper",
				],
			},
		},
		{
			uri: "popupmapper",
			schema: {
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
			},
		},
		{
			uri: "smallwidget",
			schema: {
				type: "object",
				properties: {
					title: {
						type: "string",
					},
					value: {
						$ref: "value",
					},
					text: {
						type: "string",
					},
				},
				required: ["title", "value"],
			},
		},
		{
			uri: "mediumwidget",
			schema: {
				type: "object",
				properties: {
					title: {
						type: "string",
					},
					description: {
						type: "string",
					},
					graph: {
						$ref: "graph",
					},
				},
				required: ["title", "graph"],
			},
		},
		{
			uri: "largewidget",
			schema: {
				type: "object",
				properties: {
					title: {
						type: "string",
					},
					graph: {
						$ref: "graph",
					},
				},
				required: ["title", "graph"],
			},
		},
		{
			uri: "graph",
			schema: {
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
						$ref: "value",
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
			},
		},
		{
			uri: "value",
			schema: {
				type: "object",
				properties: {
					mathOperation: {
						type: "string",
					},
					attributePath: {
						oneOf: [
							{
								$ref: "attributePath",
							},
							{
								type: "string",
							},
						],
					},
					value1: {
						$ref: "value",
					},
					value2: {
						$ref: "value",
					},
				},
				required: ["mathOperation"],
			},
		},
		{
			uri: "attributePath",
			schema: {
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
			},
		},
	];
}
