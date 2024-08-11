import React, { useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon";
import CaptureForm from "../components/CaptureForm";
import Loader from "@/components/Loader";
import TypeBadge from "@/components/ui/TypeBadge";

const Home = () => {
	const [page, setPage] = React.useState(0);
	const limit = 10;
	const offset = page * limit;
	const {
		data: pokemonData,
		isFetching,
		isLoading,
		isError,
		error,
	} = usePokemon(limit, offset);

	const handleNext = () => setPage((prev) => prev + 1);
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

	useEffect(() => {
		console.log(isLoading);
		console.log("loading");
	}, [isLoading]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Pokédex</h1>
			{isLoading || (isFetching && <Loader />)}
			{isError && <p>Error: {error.message}</p>}
			{!isLoading && !isFetching && pokemonData && (
				<ul key={page}>
					{pokemonData.map((pokemon) => (
						<li key={pokemon.id} className="mb-4">
							<div className="flex items-center">
								<div className="border shrink-0 border-gray-500/70 rounded-md p-5 mr-4">
									<img
										src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
										alt={pokemon.name}
										className="w-24 h-24 "
									/>
								</div>
								<div className="mr-4">
									<p>
										<strong>ID:</strong> {pokemon.id}
									</p>
									<p>
										<strong>Name:</strong>{" "}
										{pokemon.name.charAt(0).toUpperCase() +
											pokemon.name.slice(1)}
									</p>
									<div className="flex gap-1">
										<strong>Types:</strong>
										<div className="flex gap-1">
											{pokemon.types.map((t: { type: { name: any } }) => (
												<TypeBadge typeName={t.type.name} />
											))}
										</div>
									</div>
									<p>
										<strong>Stats:</strong>
									</p>
									<ul>
										{pokemon.stats.map(
											(stat: {
												stat: { name: React.Key | null | undefined };
												base_stat:
													| string
													| number
													| bigint
													| boolean
													| React.ReactElement<
															any,
															string | React.JSXElementConstructor<any>
													  >
													| Iterable<React.ReactNode>
													| React.ReactPortal
													| Promise<React.AwaitedReactNode>
													| null
													| undefined;
											}) =>
												stat.stat.name && (
													<li key={stat.stat.name} className="uppercase">
														{stat.stat.name
															.toString()
															.split("-")
															.map(
																(word: string) =>
																	word.charAt(0).toUpperCase() + word.slice(1)
															)
															.join(" ")}
														: {stat.base_stat}
													</li>
												)
										)}
									</ul>
								</div>
								<CaptureForm pokemonName={pokemon.name} />
							</div>
						</li>
					))}
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
