/**
 * This function retrieves the value of a nested property in an object or an array of objects.
 *
 * @param {any} object - The object to retrieve the property from. This can be any JavaScript object or array of objects.
 * @param {string} path - The path to the property to retrieve. This should be a string of property names separated by dots, e.g. 'property1.property2.property3'. If the path points to a property that is an array of objects, the function will return an array of the values of the specified property for each object in the array.
 *
 * @returns {any} The value or array of values of the specified property.
 *
 * @example
 * const obj = { a: { b: { c: 'value' } } };
 * getNestedProperty(obj, 'a.b.c'); // returns 'value'
 *
 * @example
 * const obj = { a: [{ b: 'value1' }, { b: 'value2' }] };
 * getNestedProperty(obj, 'a.b'); // returns ['value1', 'value2']
 */
export function getNestedProperty(
	object: any,
	path: string
): string | string[] | undefined {
	if (!path) return object;
	const keys = path.split(".");
	return keys.reduce((currentObject, key, index) => {
		if (currentObject) {
			if (Array.isArray(currentObject)) {
				return currentObject.map((item: any) =>
					getNestedProperty(item, keys.slice(index).join("."))
				);
			} else {
				return currentObject[key];
			}
		} else {
			return undefined;
		}
	}, object);
}
