import { useQuery, keepPreviousData } from "@tanstack/react-query";

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
}

const fetchPokemonData = async (
	limit: number,
	offset: number
): Promise<Pokemon[]> => {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();

	const detailedDataPromises = data.results.map(
		async (pokemon: { name: string; url: string }) => {
			const res = await fetch(pokemon.url);
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}
			return res.json(); // Assumes response matches expected structure
		}
	);

	return Promise.all(detailedDataPromises);
};

export const usePokemon = (limit: number, offset: number) => {
	return useQuery({
		queryKey: ["pokemon", limit, offset],
		queryFn: () => fetchPokemonData(limit, offset),
		placeholderData: keepPreviousData, // Keeps previous data until new data is loaded
		staleTime: 60000, // Data considered fresh for 60 seconds
	});
};
