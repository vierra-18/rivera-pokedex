import { usePokemon } from "../hooks/usePokemon";
import { useState } from "react";
import CaptureForm from "../components/CaptureForm";
import Loader from "@/components/Loader";
// import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
	const [page, setPage] = useState(0);
	const { pokemonData, loading } = usePokemon(10, page * 10);

	const handleNext = () => setPage((prevPage) => prevPage + 1);
	const handlePrev = () => setPage((prevPage) => Math.max(prevPage - 1, 0));

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Pokédex</h1>
			{/* <ThemeToggle /> */}
			{loading ? (
				<Loader />
			) : (
				<ul>
					{pokemonData.map((pokemon, index) => {
						const pokemonIndex = pokemon.url.split("/").slice(-2, -1)[0]; // Extract pokedex number
						const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`;

						return (
							<li key={index} className="mb-4 flex items-center">
								<img
									src={imageUrl}
									alt={pokemon.name}
									className="w-16 h-16 mr-4"
								/>
								<span className="capitalize mr-4">{pokemon.name}</span>
								<CaptureForm pokemonName={pokemon.name} />
							</li>
						);
					})}
				</ul>
			)}
			<div className="mt-4 flex justify-between">
				<button
					onClick={handlePrev}
					disabled={page === 0}
					className="bg-gray-500 text-white p-2 rounded disabled:opacity-50"
				>
					Previous
				</button>
				<button
					onClick={handleNext}
					className="bg-blue-500 text-white p-2 rounded"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Home;
