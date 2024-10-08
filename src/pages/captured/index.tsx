import { useEffect, useState } from "react";

type Pokemon = {
	id: number;
	name: string;
	sprites: any;
	types: { type: { name: string } }[];
	typeAdvantages: {
		weaknesses: string[];
		strengths: string[];
	};
	flavorText: string;
	stats: {
		stat: { name: string };
		base_stat: number;
	}[];
};
interface CapturedPokemon {
	name: string;
	pokemon: Pokemon;
	nickname: string;
	date: string;
}

export const getCapturedPokemons = (): CapturedPokemon[] => {
	const storedData = localStorage.getItem("captured");
	return storedData ? JSON.parse(storedData) : [];
};

const Captured = () => {
	const [capturedPokemons, setCapturedPokemons] = useState<CapturedPokemon[]>(
		[]
	);

	useEffect(() => {
		setCapturedPokemons(getCapturedPokemons());
	}, []);
	console.log(capturedPokemons, "captured pokemons");

	return (
		<div className="">
			<h1 className="text-3xl font-bold mb-4">Captured Pokémon</h1>
			{capturedPokemons.length === 0 ? (
				<p>You haven't captured any Pokémon yet.</p>
			) : (
				<ul>
					{capturedPokemons.map((pokemon, index) => (
						<li key={index} className="mb-4">
							<p>
								<strong>Name:</strong> {pokemon.pokemon.name}
							</p>
							<p>
								<strong>Nickname:</strong> {pokemon.nickname}
							</p>
							<p>
								<strong>Capture Date:</strong> {pokemon.date}
							</p>
						</li>
					))}
				</ul>
			)}
			<p>
				<a href="/" className="text-blue-500">
					Return to Pokedex
				</a>
			</p>
		</div>
	);
};

export default Captured;
