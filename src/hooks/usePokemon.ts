// hooks/usePokemon.ts
import { useEffect, useState } from 'react';

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

export const usePokemon = (limit: number, offset: number) => {
    const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // For error handling

    useEffect(() => {
        const fetchPokemonData = async () => {
            setLoading(true);
            setError(null); // Reset error state on new fetch
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
                const data = await response.json();
                
                // Fetch detailed info for each Pokémon
                const detailedDataPromises = data.results.map(async (pokemon: { name: string; url: string }) => {
                    const res = await fetch(pokemon.url);
                    return res.json(); // Assuming the response is valid
                });

                const detailedData = await Promise.all(detailedDataPromises);
                setPokemonData(detailedData);
            } catch (err) {
                setError('Failed to fetch Pokémon data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonData();
    }, [limit, offset]);

    return { pokemonData, loading, error };
};
