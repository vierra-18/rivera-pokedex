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

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

const fetchPokemonData = async (
  limit: number,
  offset: number,
  searchQuery: string = ""
): Promise<Pokemon[]> => {
  const maxPokemon = 151;
  const adjustedLimit = Math.min(limit, maxPokemon - offset);
  const url = searchQuery
    ? `${POKEAPI_BASE_URL}/pokemon?limit=${maxPokemon}&offset=0`
    : `${POKEAPI_BASE_URL}/pokemon?limit=${adjustedLimit}&offset=${offset}`;

  const response = await axios.get(url);
  const data = response.data;

  const detailedDataPromises = data.results.map(
    async (pokemon: { name: string; url: string }) => {
      if (searchQuery && !pokemon.name.includes(searchQuery.toLowerCase())) {
        return null;
      }

      const pokemonResponse = await axios.get(pokemon.url);
      const pokemonData = pokemonResponse.data;

      const speciesResponse = await axios.get(pokemonData.species.url);
      const speciesData = speciesResponse.data;

      const flavorTextEntry = speciesData.flavor_text_entries.find(
        (entry: { language: { name: string } }) => entry.language.name === "en"
      );

      return {
        ...pokemonData,
        flavorText: flavorTextEntry ? flavorTextEntry.flavor_text : "",
      };
    }
  );

  return (await Promise.all(detailedDataPromises)).filter(
    Boolean
  ) as Pokemon[];
};

const fetchTypeDetails = async (typeName: string): Promise<TypeDetails> => {
  const response = await axios.get(`${POKEAPI_BASE_URL}/type/${typeName}`);
  return response.data;
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

  const weaknesses = new Set<string>();
  const strengths = new Set<string>();
  const normalTypes = new Set<string>();

  for (const [key, damageTypes] of Object.entries(damageRelations)) {
    if (key.startsWith("double_damage_from")) {
      damageTypes.forEach((type) => {
        if (!damageRelations.no_damage_from.has(type) && !damageRelations.half_damage_from.has(type)) {
          weaknesses.add(type);
        }
      });
    } else if (key.startsWith("half_damage_from")) {
      damageTypes.forEach((type) => {
        if (!damageRelations.no_damage_from.has(type) && !damageRelations.double_damage_from.has(type)) {
          strengths.add(type);
        }
      });
    } else if (key.startsWith("double_damage_to")) {
      damageTypes.forEach((type) => {
        if (!damageRelations.no_damage_to.has(type) && !damageRelations.half_damage_to.has(type)) {
          strengths.add(type);
        }
      });
    } else if (key.startsWith("half_damage_to")) {
      damageTypes.forEach((type) => {
        if (!damageRelations.no_damage_to.has(type) && !damageRelations.double_damage_to.has(type)) {
          weaknesses.add(type);
        }
      });
    }
  }

  const allTypes = new Set([
    ...damageRelations.double_damage_from,
    ...damageRelations.half_damage_from,
    ...damageRelations.double_damage_to,
    ...damageRelations.half_damage_to,
  ]);

  normalTypes.forEach((type) => {
    if (!weaknesses.has(type) && !strengths.has(type)) {
      normalTypes.add(type);
    }
  });

  return {
    weaknesses: Array.from(weaknesses),
    strengths: Array.from(strengths),
    normalTypes: Array.from(normalTypes),
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
          typeAdvantages,
        };
      });

      return Promise.all(typeAdvantagePromises);
    },
    placeholderData: [],
    staleTime: 60000,
  });
};
