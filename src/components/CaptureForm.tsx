import { useState, useEffect, useRef } from "react";
import PokeButton from "./ui/Pokeball";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Pokemon = {
	id: number;
	name: string;
	types: { type: { name: string } }[];
	sprites: any;
	typeAdvantages: {
		weaknesses: string[];
		strengths: string[];
	};
	stats: {
		stat: { name: string };
		base_stat: number;
	}[];
};

const CaptureForm = ({
	pokemon,
	pokemonName,
}: {
	pokemonName: string;
	pokemon: Pokemon;
}) => {
	const [nickname, setNickname] = useState<string[]>(Array(10).fill(""));
	const [date, setDate] = useState<Date | null>(new Date());
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [isCaptured, setIsCaptured] = useState<boolean>(false);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
	const modalRef = useRef<HTMLFieldSetElement | null>(null); // Reference to the modal content

	const handleCapture = () => {
		const capturedPokemons = JSON.parse(
			localStorage.getItem("captured") || "[]"
		);
		const finalNickname = nickname.join("");
		console.log("Nickname:", finalNickname);
		const newEntry = { nickname, date, pokemon, name: pokemonName };
		localStorage.setItem(
			"captured",
			JSON.stringify([...capturedPokemons, newEntry])
		);

		// Reset fields after capture
		setIsCaptured(true);
	};

	const handleOpenModal = () => {
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setIsModalVisible(false);
			setNickname(Array(10).fill(""));
			setIsCaptured(false);
		}
	};

	useEffect(() => {
		if (isModalVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isModalVisible]);

	const handleChange = (index: number, value: string) => {
		if (value.length <= 1) {
			const newNickname = [...nickname];
			newNickname[index] = value;
			setNickname(newNickname);
			console.log(nickname);

			// Move to the next input field if not the last input
			if (value && index < 9) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !nickname[index]) {
			if (index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
		}
	};

	return (
		<div className="flex items-baseline gap-4 my-1 flex-wrap">
			<button
				className="border-2 border-white rounded-full relative w-fit p-3 px-4 flex justify-center items-center disabled:brightness-50 group"
				onClick={handleOpenModal}
			>
				<div className="pokeball shake absolute top-0.5 left-1" id="normal" />
				<span className="ml-[2.5rem] text-xl capitalize">Capture</span>
			</button>

			{/* Modal */}
				<AnimatePresence>
					{isModalVisible && (
						<motion.div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-lg bg-opacity-80 z-50">
							{!isCaptured ? (
								<motion.fieldset
									key={"notCaptured"}
									ref={modalRef}
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.5 }}
									transition={{ duration: 0.3 }}
									className="bg-neutral-900/20 border border-gray-700/40  sm:pb-12 pb-[20vw] text-white flex flex-col justify-center items-center sm:flex-row gap-4 p-6 rounded-lg"
								>
									<legend className="capitalize p-1 px-3 mx-auto text-white border bg-red-700  rounded-md ">{`give ${pokemon.name} a nickname?`}</legend>
									<div className="flex flex-col w-24  pb-1 items-center relative">
										<Image
											src={pokemon.sprites.front_default}
											alt={`${pokemon.name}`}
											width={400}
											height={400}
											quality={100}
											className="w-20 h-auto z-10"
										/>
										<div className="bottom-0 border border-gray-700/60 h-10 w-24 rounded-[50%] absolute bg-gradient-to-b from-white/10 to-gray-900/70 z-0"></div>
									</div>
									<div className="flex flex-col justify-end relative items-center sm:items-end">
										<div className="flex space-x-1 justify-center  items-center">
											{nickname.map((char, index) => (
												<input
													key={index}
													ref={(el) => {
														inputRefs.current[index] = el;
													}}
													type="text"
													value={char}
													maxLength={1}
													onChange={(e) => handleChange(index, e.target.value)}
													onKeyDown={(e) => handleKeyDown(index, e)}
													className="w-4 h-fit text-center border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-gray-200"
												/>
											))}
										</div>
										<button
											onClick={handleCapture}
											className="space-x-1 mt-3 py-1 px-2 absolute -mb-12 bg-purple-800/80 uppercase text-sm rounded-lg border !text-center"
										>
											<span>o</span>
											<span>k</span>
										</button>
									</div>
								</motion.fieldset>
							) : (
								<motion.fieldset
									key={"captured"}
									ref={modalRef}
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.5 }}
									transition={{ duration: 0.3 }}
									className="bg-neutral-900/20 border border-gray-700/40  sm:pb-12 pb-[20vw] text-white flex flex-col justify-center items-center sm:flex-row gap-4 p-6 rounded-lg"
								>
									<legend className="capitalize p-1 px-3 mx-auto text-white border bg-yellow-700 rounded-md ">{`${
										nickname[0] != "" ? nickname.join("") : pokemon.name
									} has been caught!`}</legend>
									<div className="flex flex-col w-24 items-center relative">
										<Image
											src={pokemon.sprites.front_default}
											alt={`${pokemon.name}`}
											width={400}
											height={400}
											quality={100}
											className="w-20 h-auto z-10"
										/>
										<div className="bottom-0 border border-gray-700/60 h-10 w-24 rounded-[50%] absolute bg-gradient-to-b from-white/10 to-gray-900/70 z-0"></div>
									</div>
								</motion.fieldset>
							)}
						</motion.div>
					)}
				</AnimatePresence>
		</div>
	);
};

export default CaptureForm;
