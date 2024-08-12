import React, { useState, useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon";
import Loader from "@/components/Loader";
import PokemonList from "@/components/PokemonList";

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const limit = 12;
	const offset = page * limit;

	const { data: pokemonData, isFetching, isLoading, isError, error } = usePokemon(
		limit,
		offset,
		searchQuery
	);

	const handleNext = () => setPage((prev) => prev + 1);
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setPage(0); // Reset to the first page on a new search
	};

	const handlePokemonClick = (pokemon: any) => {
		console.log(pokemon.name, pokemon.flavorText, "Flavor Text");
	};

	useEffect(() => {
		console.log(isLoading, "loading");
	}, [isLoading]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Pokédex</h1>
			<input
				type="text"
				placeholder="Search Pokémon"
				value={searchQuery}
				onChange={handleSearchChange}
				className="mb-4 p-2 border border-gray-300 rounded w-full"
			/>
			{isLoading || (isFetching && <Loader />)}
			{isError && <p>Error: {error.message}</p>}
			{!isLoading && !isFetching && pokemonData && (
				<PokemonList
					pokemonData={pokemonData}
					onPokemonClick={handlePokemonClick}
				/>
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
