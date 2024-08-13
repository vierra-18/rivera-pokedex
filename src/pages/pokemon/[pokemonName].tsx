import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TypeBadge from "@/components/ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";
import TypeAdvantage from "@/components/TypeAdvantage";
import { getCapturedPokemons } from "../../pages/captured";
import Image from "next/image";
import RadarChart from "@/components/ui/RadarChart"; // Import the RadarChart component
import HorizontalBarChart from "@/components/ui/HorizontalChart";
import { useWindowSize } from "@uidotdev/usehooks";
import CaptureForm from "@/components/CaptureForm";
import Link from "next/link";

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

const PokemonPage = () => {
	const router = useRouter();
	const [pokemon, setPokemon] = useState<Pokemon | null>(null);
	const [capturedPokemons, setCapturedPokemons] = useState<string[]>([]);
	const size = useWindowSize();

	useEffect(() => {
		const storedPokemon = sessionStorage.getItem("selectedPokemon");
		if (storedPokemon) {
			setPokemon(JSON.parse(storedPokemon));
		} else {
			router.push("/"); // Redirect to home if no Pokémon is stored
		}

		// Fetch captured Pokémon names
		setCapturedPokemons(
			getCapturedPokemons().map((pokemon: { name: any }) => pokemon.name)
		);
	}, [router]);

	if (!pokemon) {
		return <p>Loading...</p>;
	}

	const formattedId = pokemon.id.toString().padStart(3, "0");
	const cleanedFlavorText = pokemon.flavorText
		.replace(/\n/g, " ") // Replace newline characters with space
		.replace(/\f/g, " ") // Replace form feed characters with space
		.trim(); // Remove leading/trailing whitespace

	const isCaptured = capturedPokemons.includes(pokemon.name);

	console.log(size.width);

	console.log(pokemon);
	return (
		<div className="flex relative items-center justify-center  py-20 min-h-screen !overflow-x-hidden flex-col gap-5 montserrat">
			<Link
				href={"/"}
				className="border border-l-0 absolute top-0 left-0 m-5 px-4 py-2  flex items-center outline-none leading-6  before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:ease-[cubic-bezier(.25,.8,.25,1)] before:duration-[.42s] before:w-0 before:hover:bg-white before:hover:w-12 uppercase font-bold rounded-md text-sm"
			>
				Back
			</Link>
			<div className="sm:max-w-[50vw] max-w-[80vw] flex flex-col gap-5">
				<div className="flex justify-center h-[25vh] relative items-center rounded-md border border-gray-500/70 gradient-2">
					<Image
						src={pokemon.sprites.front_default}
						alt={pokemon.name}
						width={400}
						height={400}
						quality={100}
						className="w-[10rem] absolute h-auto"
					/>
					{isCaptured && (
						<div
							className="pokeball still absolute bottom-0 right-0 m-5"
							id="normal"
						/>
					)}
				</div>
				<div className="flex flex-col">
					<div className="capitalize text-2xl font-bold flex items-baseline">
						{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}{" "}
						<p className="opacity-40 text-base text-center">#{formattedId}</p>
					</div>
					<div className="flex gap-1">
						<div className="flex gap-1 flex-wrap">
							{pokemon.types.map((t) => (
								<TypeBadge
									key={t.type.name}
									typeName={t.type.name as PokemonTypeName}
								/>
							))}
						</div>
					</div>
				</div>

				<blockquote className="text-2xl font-thin">
					{cleanedFlavorText}
				</blockquote>

				<div className="flex flex-col">
					<span className="capitalize text-xl font-bold">stats</span>
					<div className="flex justify-center items-center">
						{/* {size.width && size.width < 640 ? (
							<RadarChart stats={pokemon.stats} />
						) : (
							<HorizontalBarChart stats={pokemon.stats} />
						)} */}
						<HorizontalBarChart stats={pokemon.stats} />
					</div>
				</div>
				<div className="flex flex-col">
					<span className="capitalize text-xl font-bold">weaknesses</span>
					<TypeAdvantage weaknesses={pokemon.typeAdvantages.weaknesses} />
				</div>
				{/* <div className="flex flex-col">
					<span className="capitalize text-xl font-bold">weaknesses</span>
					<TypeAdvantage strengths={pokemon.typeAdvantages.strengths} />
					</div> */}

				<div className="flex flex-col">
					<span className="capitalize text-xl font-bold">Capture</span>
					<CaptureForm pokemon={pokemon} pokemonName={pokemon.name} />
				</div>
			</div>
		</div>
	);
};

export default PokemonPage;
