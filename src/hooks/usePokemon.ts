import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PokemonStat {
	base_stat: number;
	stat: { name: string };
}

interface PokemonType {
	type: { name: string };
}

interface Pokemon {
	id: number;
	name: string;
	stats: PokemonStat[];
	types: PokemonType[];
	flavorText: string;
}

interface TypeDetails {
	damage_relations: {
		double_damage_from: { name: string }[];
		double_damage_to: { name: string }[];
		half_damage_from: { name: string }[];
		half_damage_to: { name: string }[];
		no_damage_from: { name: string }[];
		no_damage_to: { name: string }[];
	};
}

const fetchPokemonData = async (
	limit: number,
	offset: number,
	searchQuery: string = ""
): Promise<Pokemon[]> => {
	const maxPokemon = 151;
	const adjustedLimit = Math.min(limit, maxPokemon - offset);

	let url = `https://pokeapi.co/api/v2/pokemon?limit=${adjustedLimit}&offset=${offset}`;

	if (searchQuery) {
		// Note: The PokeAPI does not have a built-in search feature by name
		// so you'll need to adjust this to fit your API or implement filtering after fetching.
		url = `https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=0`;
	}

	const response = await axios.get(url);
	const data = response.data;

	const detailedDataPromises = data.results.map(
		async (pokemon: { name: string; url: string }) => {
			if (searchQuery && !pokemon.name.includes(searchQuery.toLowerCase())) {
				return null; // Filter out Pokémon that don't match the search query
			}

			const pokemonResponse = await axios.get(pokemon.url);
			const pokemonData = pokemonResponse.data;

			const speciesResponse = await axios.get(pokemonData.species.url);
			const speciesData = speciesResponse.data;

			const flavorTexts = speciesData.flavor_text_entries.filter(
				(entry: { language: { name: string } }) => entry.language.name === "en"
			);

			// Pick a random flavor text entry
			const randomFlavorText =
				flavorTexts[
					Math.floor(Math.random() * flavorTexts.length)
				]?.flavor_text || "";

			return {
				...pokemonData,
				flavorText: randomFlavorText,
			};
		}
	);

	// Filter out null results (i.e., non-matching Pokémon)
	return (await Promise.all(detailedDataPromises)).filter(Boolean) as Pokemon[];
};

const fetchTypeDetails = async (typeName: string): Promise<TypeDetails> => {
	const response = await axios.get(
		`https://pokeapi.co/api/v2/type/${typeName}`
	);
	return response.data;
};

const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
	return new Set([...setA].filter((item) => !setB.has(item)));
};

const getTypeAdvantagesAndWeaknesses = async (types: string[]) => {
	const damageRelations: Record<
		keyof TypeDetails["damage_relations"],
		Set<string>
	> = {
		double_damage_from: new Set<string>(),
		double_damage_to: new Set<string>(),
		half_damage_from: new Set<string>(),
		half_damage_to: new Set<string>(),
		no_damage_from: new Set<string>(),
		no_damage_to: new Set<string>(),
	};

	for (const type of types) {
		try {
			const typeDetails = await fetchTypeDetails(type);

			for (const key of Object.keys(typeDetails.damage_relations) as Array<
				keyof TypeDetails["damage_relations"]
			>) {
				typeDetails.damage_relations[key].forEach((damageRelationType) =>
					damageRelations[key].add(damageRelationType.name)
				);
			}
		} catch (error) {
			console.error("Error fetching type details:", error);
		}
	}

	const result = {
		weaknesses: new Set<string>(),
		strengths: new Set<string>(),
		normalTypes: new Set<string>(),
	};

	const processTypeEffectiveness = (type: string) => {
		const weaknesses = new Set<string>();
		const strengths = new Set<string>();

		for (const key of Object.keys(damageRelations) as Array<
			keyof TypeDetails["damage_relations"]
		>) {
			damageRelations[key].forEach((damageRelationType) => {
				if (key === "double_damage_from") {
					if (
						!damageRelations.no_damage_from.has(damageRelationType) &&
						!damageRelations.half_damage_from.has(damageRelationType)
					) {
						weaknesses.add(damageRelationType);
					}
				} else if (key === "half_damage_from") {
					if (
						!damageRelations.no_damage_from.has(damageRelationType) &&
						!damageRelations.double_damage_from.has(damageRelationType)
					) {
						strengths.add(damageRelationType);
					}
				} else if (key === "double_damage_to") {
					if (
						!damageRelations.no_damage_to.has(damageRelationType) &&
						!damageRelations.half_damage_to.has(damageRelationType)
					) {
						strengths.add(damageRelationType);
					}
				} else if (key === "half_damage_to") {
					if (
						!damageRelations.no_damage_to.has(damageRelationType) &&
						!damageRelations.double_damage_to.has(damageRelationType)
					) {
						weaknesses.add(damageRelationType);
					}
				}
			});
		}

		return { weaknesses, strengths };
	};

	// Process effectiveness for each type
	const typeEffectivenessResults = types.map((type) =>
		processTypeEffectiveness(type)
	);

	// Aggregate results
	typeEffectivenessResults.forEach(({ weaknesses, strengths }) => {
		weaknesses.forEach((type) => {
			if (
				!damageRelations.no_damage_from.has(type) &&
				!damageRelations.half_damage_from.has(type)
			) {
				result.weaknesses.add(type);
			}
		});

		strengths.forEach((type) => {
			if (
				!damageRelations.no_damage_to.has(type) &&
				!damageRelations.half_damage_to.has(type)
			) {
				result.strengths.add(type);
			}
		});
	});

	// Determine normal effectiveness
	const normalEffectiveTypes = new Set<string>();

	for (const type of damageRelations.double_damage_to) {
		if (
			!damageRelations.no_damage_to.has(type) &&
			!damageRelations.half_damage_to.has(type) &&
			!damageRelations.double_damage_from.has(type) &&
			!damageRelations.half_damage_from.has(type)
		) {
			normalEffectiveTypes.add(type);
		}
	}

	for (const type of damageRelations.half_damage_to) {
		if (
			!damageRelations.no_damage_to.has(type) &&
			!damageRelations.double_damage_to.has(type) &&
			!damageRelations.double_damage_from.has(type) &&
			!damageRelations.half_damage_from.has(type)
		) {
			normalEffectiveTypes.add(type);
		}
	}

	// Remove normal effective types from weaknesses and strengths
	result.weaknesses = difference(result.weaknesses, normalEffectiveTypes);
	result.strengths = difference(result.strengths, normalEffectiveTypes);

	// Accumulate remaining types for informational purposes
	const allTypes = new Set([
		...damageRelations.double_damage_from,
		...damageRelations.half_damage_from,
		...damageRelations.double_damage_to,
		...damageRelations.half_damage_to,
	]);

	result.normalTypes = difference(
		allTypes,
		new Set([...result.weaknesses, ...result.strengths])
	);

	return {
		weaknesses: Array.from(result.weaknesses),
		strengths: Array.from(result.strengths),
		normalTypes: Array.from(result.normalTypes),
	};
};

export const usePokemon = (
	limit: number,
	offset: number,
	searchQuery: string = ""
) => {
	return useQuery({
		queryKey: ["pokemon", limit, offset, searchQuery],
		queryFn: async () => {
			const pokemons = await fetchPokemonData(limit, offset, searchQuery);
			const typeAdvantagePromises = pokemons.map(async (pokemon) => {
				const types = pokemon.types.map((t) => t.type.name);
				const typeAdvantages = await getTypeAdvantagesAndWeaknesses(types);
				return {
					...pokemon,
					typeAdvantages: typeAdvantages,
				};
			});

			return Promise.all(typeAdvantagePromises);
		},
		placeholderData: [], // Keeps previous data until new data is loaded
		staleTime: 60000, // Data considered fresh for 60 seconds
	});
};
