// components/PokemonList.tsx
import React from "react";
import TypeBadge from "@/components/ui/TypeBadge";
import TypeAdvantage from "@/components/TypeAdvantage";
import CaptureForm from "@/components/CaptureForm";
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
	onPokemonClick: (pokemon: Pokemon) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
	pokemonData,
	onPokemonClick,
}) => {
	return (
		<ul className="flex flex-wrap justify-center gap-3">
			{pokemonData.map((pokemon) => (
				<li
					key={pokemon.id}
					className="border border-gray-500/70 rounded-md  min-w-[25rem]"
					onClick={() => onPokemonClick(pokemon)}
				>
					<div className="flex items-center">
						<div className=" shrink-0  rounded-md p-5 mr-4">
							<img
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
								alt={pokemon.name}
								className="w-24 h-24"
							/>
						</div>
						<div className="mr-4">
							<p>
								<strong>ID:</strong> {pokemon.id}
							</p>
							<p>
								<strong>Name:</strong>{" "}
								{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
							</p>
							<div className="flex gap-1">
								<strong>Types:</strong>
								<div className="flex gap-1">
									{pokemon.types.map((t) => (
										<TypeBadge
											key={t.type.name}
											typeName={t.type.name as PokemonTypeName}
										/>
									))}
								</div>
							</div>
							{/* <TypeAdvantage weaknesses={pokemon.typeAdvantages.weaknesses} />
							<TypeAdvantage strengths={pokemon.typeAdvantages.strengths} />

							<p>
								<strong>Stats:</strong>
							</p>
							<ul>
								{pokemon.stats.map((stat) =>
									stat.stat.name ? (
										<li key={stat.stat.name} className="uppercase">
											{stat.stat.name
												.toString()
												.split("-")
												.map(
													(word) => word.charAt(0).toUpperCase() + word.slice(1)
												)
												.join(" ")}{" "}
											: {stat.base_stat}
										</li>
									) : null
								)}
							</ul> */}
						</div>
						{/* <CaptureForm pokemonName={pokemon.name} /> */}
					</div>
				</li>
			))}
		</ul>
	);
};

export default PokemonList;
