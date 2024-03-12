import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {camelize, getCurrentInstance, toHandlerKey} from "vue";

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
