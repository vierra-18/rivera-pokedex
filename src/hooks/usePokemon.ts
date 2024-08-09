import { useEffect, useState } from 'react';
import axios from 'axios';

export const usePokemon = (limit: number, offset: number) => {
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        setPokemonData(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [limit, offset]);

  return { pokemonData, loading };
};
