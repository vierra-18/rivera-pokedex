import React from "react";
import { PokemonTypeName } from "../../utils/types"; // Adjust the import path as needed

interface TypeBadgeProps {
	typeName: PokemonTypeName;
}

const typeColors: Record<PokemonTypeName, string> = {
	normal: "#a8a878",
	fire: "#f08030",
	fighting: "#c03028",
	water: "#6890f0",
	poison: "#a040a0",
	electric: "#f8d030",
	ground: "#e0c068",
	grass: "#78c850",
	flying: "#a890f0",
	ice: "#98d8d8",
	bug: "#a8b820",
	psychic: "#f85888",
	rock: "#b8a038",
	ghost: "#705898",
	dragon: "#7038f8",
	dark: "#705848",
	steel: "#b8b8d0",
	fairy: "#ffb7fa",
};

const lightenColor = (color: string, percent: number) => {
	const num = parseInt(color.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) + amt;
	const G = (num >> 8) + amt;
	const B = (num & 0x00ff) + amt;
	return (
		"#" +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)
	);
};

const darkenColor = (color: string, percent: number) => {
	const num = parseInt(color.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) - amt;
	const G = (num >> 8) - amt;
	const B = (num & 0x00ff) - amt;
	return (
		"#" +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)
	);
};

const TypeBadge: React.FC<TypeBadgeProps> = ({ typeName }) => {
	const backgroundColor = typeColors[typeName] || "#ddd";
	const borderTopColor = lightenColor(backgroundColor, 15);
	const borderBottomColor = darkenColor(backgroundColor, 15);

	const style = {
		backgroundColor,
		borderTopColor,
		borderBottomColor,
		color: "#fff",
		textTransform: "uppercase" as const,
		padding: ".3em .4em",
		borderRadius: ".4em",
		textAlign: "center" as const,
		width: "6em",
		margin: ".1em",
		
	};

	return (
		<div className="sm:text-[.8rem] text-[.6rem] flex justify-center items-center" style={style}>
			{typeName}
		</div>
	);
};

export default TypeBadge;
