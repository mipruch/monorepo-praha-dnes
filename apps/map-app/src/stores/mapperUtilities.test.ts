import {getNestedProperty} from "./mapperUtilities";

describe("getNestedProperty", () => {
	it("should return the correct property for a simple path", () => {
		const obj = {image: {wide: {url: "123.jpg"}}};
		const result = getNestedProperty(obj, "image.wide.url");
		expect(result).toEqual("123.jpg");
	});

	it("should return an array of properties for a path that points to an array", () => {
		const obj = {
			image: {
				wide: [{url: "123.jpg"}, {url: "456.jpg"}, {url: "789.jpg"}],
			},
		};
		const result = getNestedProperty(obj, "image.wide.url");
		expect(result).toEqual(["123.jpg", "456.jpg", "789.jpg"]);
	});

	it("should return undefined for a non-existent path", () => {
		const obj = {image: {wide: {url: "123.jpg"}}};
		const result = getNestedProperty(obj, "image.narrow.url");
		expect(result).toBeUndefined();
	});

	it("should return undefined for a path that points to a non-existent array", () => {
		const obj = {
			image: {
				wide: [{url: "123.jpg"}, {url: "456.jpg"}, {url: "789.jpg"}],
			},
		};
		const result = getNestedProperty(obj, "image.narrow.url");
		expect(result).toBeUndefined();
	});
});
