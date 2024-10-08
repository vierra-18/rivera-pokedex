import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Pokeball from "../styles/assets/pokeball.svg";
import TypeBadge from "./ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";

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
interface CapturedProps {
	isGrid?: boolean; // Make isGrid optional
}
const Captured: React.FC<CapturedProps> = ({ isGrid }) => {
	const [capturedPokemons, setCapturedPokemons] = useState<CapturedPokemon[]>(
		[]
	);

	useEffect(() => {
		setCapturedPokemons(getCapturedPokemons());
	}, []);
	console.log(capturedPokemons, "captured pokemons");

	const router = useRouter();

	const handlePokemonClick = (pokemon: Pokemon) => {
		sessionStorage.setItem("selectedPokemon", JSON.stringify(pokemon));
		router.push(`/pokemon/${pokemon.name}`);
	};
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1, // Delay between animations of each item
			},
		},
	};

	const itemVariants = {
		hidden: { y: "20%", opacity: 0 },
		show: { y: "0%", opacity: 1 },
		exit: {
			y: "-20%",
			opacity: 0,
			transition: { duration: 0.3 },
		},
	};

	console.log(capturedPokemons);

	return (
		<div className="">
			{/* <h1 className="text-3xl font-bold mb-4">Captured Pokémon</h1> */}
			{capturedPokemons.length === 0 ? (
				<p>You haven't captured any Pokémon yet.</p>
			) : (
				<AnimatePresence mode="wait">
					<motion.ul
						className="flex flex-wrap justify-center gap-3 px-[3vw] lg:px-[5vw]"
						variants={containerVariants}
						initial="hidden"
						animate="show"
						exit="exit"
					>
						{capturedPokemons.map((pokemon, index) => (
							<motion.li
								key={index}
								variants={itemVariants}
								transition={{ duration: 0.5 }}
								className={`border border-gray-200/70 borderslate py-[2vw] sm:py-5 overflow-clip relative rounded-lg ${
									isGrid ? "w-[25vw] sm:w-[15rem] xl:w-[20vw]" : "w-[50rem]"
								} cursor-pointer`}
								onClick={() => handlePokemonClick(pokemon.pokemon)}
							>
								<Image
									src={Pokeball}
									alt="pokeball"
									className={`absolute invert opacity-5 ${
										isGrid
											? "scale-[1.5] sm:scale-100 sm:w-60"
											: "w-44  -top-3 -left-5 rotate-[30deg]"
									} sm:scale-[.85] sm:-top-5 sm:-left-20 -bottom-5 -right-5 sm:rotate-[30deg] rotate-[-25deg]`}
								/>
								<div
									className={`flex items-center ${
										isGrid ? "flex-col" : ""
									} sm:flex-row flex-wrap justify-center `}
								>
									<div className="shrink-0 rounded-md flex justify-center p-1 flex-1 md:mr-4 ">
										<img
											src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon.id}.png`}
											alt={pokemon.pokemon.name}
											className="sm:min-w-20 sm:w-[5w] w-[5rem] h-auto"
										/>
									</div>
									<div
										className={`flex flex-1 justify-center items-center md:items-start flex-col`}
									>
										<p className="font-extrabold sm:text-base text-xs">
											{pokemon.pokemon.name.charAt(0).toUpperCase() +
												pokemon.pokemon.name.slice(1)}
										</p>
										<p className="font- opacity-65">{pokemon.nickname}</p>
										<div className={`sm:flex gap-1 ${isGrid ? "hidden" : ""}`}>
											<div className="flex gap-1 flex-wrap justify-center md:justify-start flex-col sm:flex-row">
												{pokemon.pokemon.types.map((t) => (
													<TypeBadge
														key={t.type.name}
														typeName={t.type.name as PokemonTypeName}
													/>
												))}
												{pokemon.pokemon.types.length == 1 && (
													<div className="opacity-0  pointer-events-none hidden sm:block">
														<TypeBadge
															key={"steel"}
															typeName={"steel" as PokemonTypeName}
														/>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</motion.li>
						))}
					</motion.ul>
				</AnimatePresence>
			)}
		</div>
	);
};

export default Captured;
