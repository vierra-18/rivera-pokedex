import React, { useState, useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon";
import Loader from "@/components/Loader";
import PokemonList from "@/components/PokemonList";
import AnimatedPokeballs from "@/components/ui/AnimtedPokeballs";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import Captured from "@/components/CapturedPokemon";
import { useWindowSize } from "@uidotdev/usehooks";

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const limit = 12;
	const offset = page * limit;
	const size = useWindowSize();

	const {
		data: pokemonData,
		isFetching,
		isLoading,
		isError,
		error,
		refetch,
	} = usePokemon(limit, offset, searchQuery);

	useEffect(() => {
		refetch();
	}, []);

	const handleNext = () => setPage((prev) => prev + 1);
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setPage(0); // Reset to the first page on a new search
	};

	const [isPokedex, setIsPokedex] = useState<boolean>(true);

	const handleSidebarClick = (isPokedex: boolean) => {
		setIsPokedex(isPokedex);
		{
			size.width &&
				size.width <= 640 &&
				setTimeout(() => {
					setIsCollapsed(true);
				}, 200);
		}
	};

	const [isListView, setIsListView] = useState(true);

	const handleViewToggle = (viewState: boolean) => {
		setIsListView(viewState);
	};
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleCollapseToggle = (collapseState: boolean) => {
		setIsCollapsed(collapseState);
	};

	useEffect(() => {
		if (size.width && size.width > 1023) {
			setIsCollapsed(false);
		} else {
			setIsCollapsed(true);
		}
	}, [size.width]);

	return (
		<div className=" w-screen min-h-screen flex relative">
			<Sidebar onPokedexClick={handleSidebarClick} isCollapsed={isCollapsed} />
			<div
				className="p flex-1 max-h-screen overflow-y-scroll"
				onClick={() => {
					if (size.width && size.width < 1023) {
						setIsCollapsed(true);
						console.log(isCollapsed);
					}
				}}
			>
				<Topbar
					onViewToggle={handleViewToggle}
					onCollapseToggle={handleCollapseToggle}
					expanded={isCollapsed}
					title={!isPokedex ? "Captured" : ""}
				/>
				<div className="p-5">
					{isPokedex && (
						<input
							type="text"
							placeholder="Search Pokémon"
							value={searchQuery}
							onChange={handleSearchChange}
							className="mb-4 p-2 border border-gray-300 bg-transparent rounded lg:w-1/4"
						/>
					)}
					{isLoading ||
						(isFetching && (
							<div className="relative flex justify-center items-center dshow-guie min-h-[62vh]">
								<div className="absolute scale-[.7] ">
									<AnimatedPokeballs />
								</div>
							</div>
						))}
					{isError && <p>Error: {error.message}</p>}
					{!isLoading && !isFetching && pokemonData && (
						<div className="min-h-[60vh]">
							{isPokedex ? (
								<PokemonList
								
									isGrid={isListView}
									pokemonData={pokemonData}
									// onPokemonClick={handlePokemonClick}
								/>
							) : (
								<Captured isGrid={isListView} />
							)}
						</div>
					)}
					{isPokedex && searchQuery == "" && (
						<div className="mt-4 flex justify-center gap-4">
							<button
								onClick={handlePrev}
								disabled={page === 0}
								className="bg-gray-500 w-20 text-white p-2 rounded disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={handleNext}
								className="bg-blue-500 w-20 text-white p-2 rounded"
							>
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
