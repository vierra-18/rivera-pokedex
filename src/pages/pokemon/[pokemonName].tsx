import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TypeBadge from "@/components/ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";
import TypeAdvantage from "@/components/TypeAdvantage";
import { getCapturedPokemons } from "../captured"; // Import the function

type Pokemon = {
  id: number;
  name: string;
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

const PokemonPage = () => {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [capturedPokemons, setCapturedPokemons] = useState<string[]>([]); // Store captured Pokémon names

  useEffect(() => {
    const storedPokemon = sessionStorage.getItem("selectedPokemon");
    if (storedPokemon) {
      setPokemon(JSON.parse(storedPokemon));
    } else {
      router.push("/"); // Redirect to home if no Pokémon is stored
    }

    // Fetch captured Pokémon names
    setCapturedPokemons(getCapturedPokemons().map((pokemon: { name: any; }) => pokemon.name));
  }, [router]);

  if (!pokemon) {
    return <p>Loading...</p>;
  }

  const formattedId = pokemon.id.toString().padStart(3, "0");
  const cleanedFlavorText = pokemon.flavorText
    .replace(/\n/g, " ") // Replace newline characters with space
    .replace(/\f/g, " ") // Replace form feed characters with space
    .trim(); // Remove leading/trailing whitespace

  const isCaptured = capturedPokemons.includes(pokemon.name); // Check if Pokémon is captured

  return (
    <div className="flex items-center justify-center w-screen h-screen flex-col">
      <div className="w-fit">
        <div className="flex justify-center relative shrink-0 rounded-md p-5 border border-gray-500/70">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-24 h-24"
          />
          {isCaptured && (
            <div
              className="pokeball still absolute bottom-0 right-0 m-5"
              id="normal"
            />
          )}
        </div>
        <p>
          <strong>ID:</strong> {formattedId}
        </p>
        <p>
          <strong>Name:</strong>{" "}
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </p>{" "}
        <p>{cleanedFlavorText}</p>
        <div className="flex gap-1">
          <strong>Types:</strong>
          <div className="flex gap-1 flex-wrap">
            {pokemon.types.map((t) => (
              <TypeBadge
                key={t.type.name}
                typeName={t.type.name as PokemonTypeName}
              />
            ))}
          </div>
        </div>
        <TypeAdvantage weaknesses={pokemon.typeAdvantages.weaknesses} />
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
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}{" "}
                : {stat.base_stat}
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
};

export default PokemonPage;
