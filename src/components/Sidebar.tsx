import { FC, useState } from "react";
import Hamburger from "./ui/Hamburger";
import Batman from "../styles/assets/avataBatman.svg";
import Image from "next/image";
import Pokedex from "../styles/assets/pokedex.svg";
import Pokeball from "../styles/assets/pokeball-1.svg";

// Define the type for the props
interface SidebarProps {
	onPokedexClick: (isPokedex: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ onPokedexClick }) => {
	const [isPokedex, setIsPokedex] = useState<boolean>(true);

	const handlePokedexClick = () => {
		setIsPokedex(true);
		onPokedexClick(true); // Pass `true` when Pokédex is clicked
	};

	const handleCapturedClick = () => {
		setIsPokedex(false);
		onPokedexClick(false); // Pass `false` when Captured is clicked
	};

	return (
		<div className="max-w-[20rem] min-w-[20rem] w-1/5 flex-col hidden lg:flex py-5 border-l-2 border-l-green-900 sidebar">
			<section className="w-full h-1/2 px-2">
				<div className="w-full h-20 relative flex justify-start gap-2">
					<Image src={Batman} alt="avatar batman" className="h-20 w-fit" />
					<div className="flex flex-col h-full justify-center">
						<span className="capitalize text-2xl font-semibold tracking-wide">
							robin rivera
						</span>
						<span className="capitalize opacity-40 text-sm">
							Pokémon master
						</span>
					</div>
				</div>
			</section>
			<section className="w-full h-2/5 relative flex flex-col justify-start">
				<button
					className={`w-full flex items-center justify-start px-10 h-20 text-3xl font-bold transition-all duration-300 ${
						isPokedex ? "bg-[#2c2c2c]" : ""
					}`}
					onClick={handlePokedexClick}
				>
					<div className="w-8 mr-4">
						<Image src={Pokedex} alt="pokédex icon" className="w-fit invert" />
					</div>
					<span className="opacity-80">Pokédex</span>
				</button>
				<button
					className={`w-full flex items-center justify-start px-10 h-20 text-3xl font-bold transition-all duration-300 ${
						!isPokedex ? "bg-[#2c2c2c]" : ""
					}`}
					onClick={handleCapturedClick}
				>
					<div className="w-8 mr-4">
						<Image
							src={Pokeball}
							alt="pokeball icon"
							className="w-fit invert"
						/>
					</div>
					<span className="opacity-80">Captured</span>
				</button>
			</section>
		</div>
	);
};

export default Sidebar;
