import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TypeBadge from "@/components/ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";
import TypeAdvantage from "@/components/TypeAdvantage";
import { getCapturedPokemons } from "../../pages/captured";
import Image from "next/image";
import RadarChart from "@/components/ui/RadarChart"; // Import the RadarChart component
import BarChart from "@/components/ui/BarChart";
import { useWindowSize } from "@uidotdev/usehooks";
import CaptureForm from "@/components/CaptureForm";
import Link from "next/link";
import StarButton from "@/components/ui/StarButton";
import RotateButton from "@/components/ui/RotateButton";

type Pokemon = {
	id: number;
	name: string;
	genera: { genus: string }[];
	height: number;
	weight: number;
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
	const [isShiny, setIsShiny] = useState<boolean>(false);
	const [isBack, setIsBack] = useState<boolean>(false);
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

	const handleFormToggle = (isShiny: boolean) => {
		setIsShiny(isShiny);
	};
	const handleOrientationToggle = (isDefault: boolean) => {
		setIsBack(isDefault);
	};

	const spriteUrl = isBack
		? isShiny
			? pokemon.sprites.back_shiny
			: pokemon.sprites.back_default
		: isShiny
		? pokemon.sprites.front_shiny
		: pokemon.sprites.front_default;
	return (
		<div className="flex relative items-center justify-center  py-20 min-h-screen !overflow-x-hidden flex-col gap-5 ">
			<Link
				href={"/"}
				className="border border-l-0 absolute top-0 left-0 m-5 px-4 py-2  flex items-center outline-none leading-6  before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:ease-[cubic-bezier(.25,.8,.25,1)] before:duration-[.42s] before:w-0 before:hover:bg-white before:hover:w-12 uppercase font-bold rounded-md text-sm"
			>
				Back
			</Link>
			<div className="lg:w-[50vw] w-[80vw] border border-white/30 p-5  lg:mx-[20vw] flex flex-col rounded-2xl gap-5">
				<div className="flex flex-col-reverse sm:flex-row relative justify-between gap-3 sm:gap-0">
					<div className="flex flex-col justify-center   w-full md:w-3/5">
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
						<div className="flex justify-around p-2">
							<div className="flex flex-col py-3 ">
								<span className=" text-center text-xl">
									{(pokemon.weight / 10).toFixed(1)}
									<span className="text-sm text-white/80"> kg</span>
								</span>
								<span className="capitalize text-sm text-white/30 text-center">
									weight
								</span>
							</div>
							<span className="border opacity-25"></span>
							<div className="flex flex-col py-3 ">
								<span className=" text-center text-xl">
									{(pokemon.height / 10).toFixed(1)}
									<span className="text-sm text-white/80"> m</span>
								</span>
								<span className="capitalize text-sm text-white/30 text-center">
									height
								</span>
							</div>
							<span className="border opacity-25"></span>
							<div className="flex flex-col py-3 ">
								<span className=" text-center capitalize text-xl">
									{pokemon.genera[0].genus.replace(/Pokémon/i, "")}
								</span>
								<span className="capitalize text-sm text-white/30 text-center">
									category
								</span>
							</div>
						</div>
					</div>
					{/* <div className="absolute bg-black right-0"> */}
					<div className="flex justify-center sm:aspect-square h-40 sm:h-auto w-full sm:w-[10vw] min-w-32 relative items-center rounded-md border border-gray-500/70 gradient-2">
						<Image
							src={spriteUrl}
							alt={pokemon.name}
							width={400}
							height={400}
							quality={100}
							className="w-[6vw] min-w-24 absolute h-auto"
						/>
						{isCaptured && (
							<div
								className="pokeball still absolute bottom-0 right-0 m-5"
								id="normal"
							/>
						)}

						<div className="absolute top-0 right-0 scale-75 -m-1">
							<StarButton onFormToggle={handleFormToggle} />
						</div>
						<div className="absolute bottom-0 left-0 scale-[.40] invert opacity-50 -m-4">
							<RotateButton onOrientationToggle={handleOrientationToggle} />
						</div>
					</div>
					{/* </div> */}
				</div>

				<blockquote className="text-2xl font-thin">
					{cleanedFlavorText}
				</blockquote>

				<fieldset className="flex flex-col border border-slate-50/20 rounded-lg p-3">
					<legend className="capitalize text-xl font-bold mx-2 px-2">
						stats
					</legend>
					<div className="flex justify-center items-center">
						{/* {size.width && size.width < 640 ? (
							<RadarChart stats={pokemon.stats} />
						) : (
							<BarChart stats={pokemon.stats} />
						)} */}
						<BarChart
							stats={pokemon.stats}
							types={[pokemon.types[0].type.name]}
						/>

						{/* <RadarChart
							stats={pokemon.stats}
							types={[pokemon.types[0].type.name]}
						/> */}
					</div>
				</fieldset>
				<fieldset className="flex flex-col border border-slate-50/20 rounded-lg p-3">
					<legend className="capitalize text-xl font-bold mx-2 px-2">
						weaknesses
					</legend>
					<TypeAdvantage weaknesses={pokemon.typeAdvantages.weaknesses} />
				</fieldset>
				{/* <div className="flex flex-col">
					<span className="capitalize text-xl font-bold">weaknesses</span>
					<TypeAdvantage strengths={pokemon.typeAdvantages.strengths} />
					</div> */}

				<div className="flex flex-col  items-center">
					{/* <span className="capitalize text-xl font-bold">Capture</span> */}
					<CaptureForm pokemon={pokemon} pokemonName={pokemon.name} />
				</div>
			</div>
		</div>
	);
};

export default PokemonPage;
