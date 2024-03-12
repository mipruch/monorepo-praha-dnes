import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculatePercentage(
	currentValue: number,
	minValue: number | undefined,
	maxValue: number | undefined
) {
	const minGraph = 0; //  Minimální hodnota grafu
	const maxGraph = 100; // Maximální hodnota grafu

	if (minValue == undefined || maxValue == undefined) {
		minValue = 0;
		maxValue = 100;
	}

	// Kontrola, zda hodnoty splňují očekávané podmínky
	if (minValue >= maxValue) {
		throw new Error(
			"Minimální hodnota musí být menší než maximální hodnota."
		);
	}

	// Kontrola hraničních hodnot
	if (currentValue < minValue) return minGraph;
	if (currentValue > maxValue) return maxGraph;

	// Vypočet procentuální pozice aktuální hodnoty mezi minimální a maximální hodnotou
	const percentage = (currentValue - minValue) / (maxValue - minValue);

	// Vypočet odpovídající pixelové hodnoty pro vypočtené procento
	return (maxGraph - minGraph) * percentage + minGraph;
}

const COLORS = {
	blue: {
		darkColor: "#0066FF",
		lightColor: "#B4D2FF",
	},
	green: {
		darkColor: "#00B87C",
		lightColor: "#A0EED2",
	},
	red: {
		darkColor: "#FF4D4D",
		lightColor: "#FFB4B4",
	},
	yellow: {
		darkColor: "#FFD24D",
		lightColor: "#FFE6B4",
	},
	gradient: {
		darkColor:
			"linear-gradient(to right,#ff5a00,#cace00,#00ed00,#00b8a2,#0066ff)",
		lightColor:
			"linear-gradient(to right,#ff5a00,#cace00,#00ed00,#00b8a2,#0066ff)",
	},
};
export function getColorSchema(
	strokeColor: string | object | undefined,
	value: string | number
): {
	darkColor: string;
	lightColor: string;
} {
	if (COLORS[strokeColor as keyof typeof COLORS]) {
		return COLORS[strokeColor as keyof typeof COLORS];
	}

	if (typeof strokeColor === "object") {
		let scheme = {
			darkColor: COLORS.blue.darkColor,
			lightColor: COLORS.blue.lightColor,
		};
		Object.keys(strokeColor).forEach((key) => {
			if (parseFloat(value.toString()) > parseFloat(key)) {
				scheme = COLORS[strokeColor[key as keyof typeof strokeColor]];
			}
		});
		return scheme;
	}

	return COLORS.blue;
}
