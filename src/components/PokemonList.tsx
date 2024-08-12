// // components/PokemonList.tsx
// import React from "react";
// import TypeBadge from "@/components/ui/TypeBadge";
// import TypeAdvantage from "@/components/TypeAdvantage";
// import CaptureForm from "@/components/CaptureForm";
// import { PokemonTypeName } from "@/utils/types";

// type Pokemon = {
// 	id: number;
// 	name: string;
// 	types: { type: { name: string } }[];
// 	typeAdvantages: {
// 		weaknesses: string[];
// 		strengths: string[];
// 	};
// 	stats: {
// 		stat: { name: string };
// 		base_stat: number;
// 	}[];
// };

// interface PokemonListProps {
// 	pokemonData: Pokemon[];
// 	onPokemonClick: (pokemon: Pokemon) => void;
// }

// const PokemonList: React.FC<PokemonListProps> = ({
// 	pokemonData,
// 	onPokemonClick,
// }) => {
// 	return (
// 		<ul className="flex flex-wrap justify-center gap-3">
// 			{pokemonData.map((pokemon) => (
// 				<li
// 					key={pokemon.id}
// 					className="border border-gray-500/70 rounded-md  min-w-[25rem]"
// 					onClick={() => onPokemonClick(pokemon)}
// 				>
// 					<div className="flex items-center">
// 						<div className=" shrink-0  rounded-md p-5 mr-4">
// 							<img
// 								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
// 								alt={pokemon.name}
// 								className="w-24 h-24"
// 							/>
// 						</div>
// 						<div className="mr-4">
// 							<p>
// 								<strong>ID:</strong> {pokemon.id}
// 							</p>
// 							<p>
// 								<strong>Name:</strong>{" "}
// 								{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
// 							</p>
// 							<div className="flex gap-1">
// 								<strong>Types:</strong>
// 								<div className="flex gap-1">
// 									{pokemon.types.map((t) => (
// 										<TypeBadge
// 											key={t.type.name}
// 											typeName={t.type.name as PokemonTypeName}
// 										/>
// 									))}
// 								</div>
// 							</div>
// 							{/* <TypeAdvantage weaknesses={pokemon.typeAdvantages.weaknesses} />
// 							<TypeAdvantage strengths={pokemon.typeAdvantages.strengths} />

// 							<p>
// 								<strong>Stats:</strong>
// 							</p>
// 							<ul>
// 								{pokemon.stats.map((stat) =>
// 									stat.stat.name ? (
// 										<li key={stat.stat.name} className="uppercase">
// 											{stat.stat.name
// 												.toString()
// 												.split("-")
// 												.map(
// 													(word) => word.charAt(0).toUpperCase() + word.slice(1)
// 												)
// 												.join(" ")}{" "}
// 											: {stat.base_stat}
// 										</li>
// 									) : null
// 								)}
// 							</ul> */}
// 						</div>
// 						{/* <CaptureForm pokemonName={pokemon.name} /> */}
// 					</div>
// 				</li>
// 			))}
// 		</ul>
// 	);
// };

// export default PokemonList;

import React from "react";
import { useRouter } from "next/router";
import TypeBadge from "@/components/ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";

type Pokemon = {
	id: number;
	name: string;
	types: { type: { name: string } }[];
	typeAdvantages: {
		weaknesses: string[];
		strengths: string[];
	};
	stats: {
		stat: { name: string };
		base_stat: number;
	}[];
};

interface PokemonListProps {
	pokemonData: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemonData }) => {
	const router = useRouter();

	const handlePokemonClick = (pokemon: Pokemon) => {
		sessionStorage.setItem("selectedPokemon", JSON.stringify(pokemon));
		router.push(`/pokemon/${pokemon.name}`);
	};

	return (
		<ul className="flex flex-wrap justify-center gap-3 ">
			{pokemonData.map((pokemon) => (
				<li
					key={pokemon.id}
					className="border border-gray-500/70 rounded-md w-[50rem] cursor-pointer"
					onClick={() => handlePokemonClick(pokemon)}
				>
					<div className="flex items-center flex-wrap justify-center">
						<div className="shrink-0 rounded-md p-3 sm:mr-4">
							<img
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
								alt={pokemon.name}
								className="w-24 h-24"
							/>
						</div>
						<div className="flex justify-center items-center sm:items-start flex-col">
							<p className="font-extrabold">
								{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
							</p>
							<p className="font- opacity-65">
								#{pokemon.id.toString().padStart(3, "0")}
							</p>
							<div className="flex gap-1">
								<div className="flex gap-1 flex-wrap flex-col sm:flex-row">
									{pokemon.types.map((t) => (
										<TypeBadge
											key={t.type.name}
											typeName={t.type.name as PokemonTypeName}
										/>
									))}
									{pokemon.types.length == 1 && (
										<div className="opacity-0 show-guide pointer-events-none hidden sm:block">
											<TypeBadge
												key={"steel"}
												typeName={"steel" as PokemonTypeName}
											/>
										</div>
									)}
								</div>
							</div>
							{/* Add more Pokémon information if needed */}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default PokemonList;
